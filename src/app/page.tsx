"use client";
import React, { useState, useEffect } from "react";
import { Table } from "@radix-ui/themes";
import { readFileSync } from "fs";
import { parse, format } from "date-fns";

import { OriginalData } from "./types";

export default async function Home() {
  const url =
    "https://tokyo-haneda.com/app_resource/flight/data/int/hdacfdep.json";
  const response = await fetch(url);
  // レスポンスをチェック
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // レスポンスをJSONとしてパース
  const data: OriginalData = await response.json();

  const processedData = data.flight_info.map((flight) => {
    return {
      airlines: flight.航空会社.map((airline) => ({
        ALCode: airline.ＡＬコード,
        ALNameJP: airline.ＡＬ和名称,
        ALNameEN: airline.ＡＬ英名称,
        FlightNumber: airline.便名,
      })),
      DestinationAirportCode: flight.行先地空港コード,
      DestinationAirportNameJP: flight.行先地空港和名称,
      DestinationAirportNameEN: flight.行先地空港英名称,
      ScheduledTime: flight.定刻,
      ChangedTime: flight.変更時刻,
      TerminalDivision: flight.ターミナル区分,
      GateNumberCode: flight.ゲート番号コード,
      AircraftTypeCode: flight.機種コード,
      CheckinCounter: flight.チェックインカウンター番号,
      RemarksJP: flight.備考和名称,
      RemarksEN: flight.備考英名称,
    };
  });

  // 現在の日時を取得
  const now = new Date();

  // 現在時刻以降のフライト情報のみをフィルタリング
  const futureFlights = processedData.filter((flight) => {
    const scheduledTime = parse(
      flight.ScheduledTime.trim(),
      "yyyy/MM/dd HH:mm:ss",
      new Date()
    );
    return scheduledTime >= now;
  });
  return (
    <div>
      <Table.Root>
        <Table.Header className="bg-gray-700 h-14 ">
          <Table.Row>
            <Table.ColumnHeaderCell className="text-white font-medium text-xl ">
              Scheduled
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-white font-medium text-xl ">
              Estimated
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-white font-medium text-xl ">
              Destination
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-white font-medium text-xl ">
              Flight
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-white font-medium text-xl ">
              Checkin
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-white font-medium text-xl ">
              Remarks
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {futureFlights.map((flightInfo, index) => {
            // 'date-fns' を使用して日付を解析
            const parsedSchedule = parse(
              flightInfo.ScheduledTime.trim(),
              "yyyy/MM/dd HH:mm:ss",
              new Date()
            );
            const parsedChanged = parse(
              flightInfo.ChangedTime.trim(),
              "yyyy/MM/dd HH:mm:ss",
              new Date()
            );

            // 時刻のみをフォーマット
            const ProcessedScheduledTime = format(parsedSchedule, "HH:mm");
            const ProcessedChangedTime =
              flightInfo.ChangedTime.trim() === ""
                ? null
                : format(parsedChanged, "HH:mm");

            //チェックインカウンターが複数ある場合別々のコンテナに表示
            const checkinCounters = flightInfo.CheckinCounter.split("/").map(
              (counter, index) => (
                <div
                  key={index}
                  className="bg-gray-100 outline outline-blue-500 p-3 m-2 flex w-10 h-10 justify-center items-center text-gray-900 font-normal"
                >
                  {counter}
                </div>
              )
            );

            return (
              <Table.Row
                key={index}
                className="bg-gradient-to-t from-blue-800 to-blue-700 p-1 border-b border-gray-400"
              >
                <Table.RowHeaderCell className="text-3xl text-white">
                  {ProcessedScheduledTime}
                </Table.RowHeaderCell>
                <Table.Cell className="text-2xl text-yellow-300">
                  {ProcessedChangedTime}
                </Table.Cell>
                <Table.Cell className="text-2xl text-white">
                  {flightInfo.DestinationAirportNameJP}
                  <br />
                  <p className="text-sm">
                    {flightInfo.DestinationAirportNameEN}
                  </p>
                </Table.Cell>
                <Table.Cell className="text-2xl text-white">
                  {flightInfo.airlines.map((airline, index) => (
                    <div key={index}>
                      {airline.ALCode} {airline.FlightNumber}
                    </div>
                  ))}
                </Table.Cell>
                <Table.Cell className="text-2xl text-white flex">
                  {checkinCounters}
                </Table.Cell>
                <Table.Cell className="text-2xl text-white">
                  {flightInfo.RemarksJP}
                  <br />
                  {flightInfo.RemarksEN}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
