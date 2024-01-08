"use client";
import { Table } from "@radix-ui/themes";
import { parse, getTime } from "date-fns";
import { format, formatInTimeZone, utcToZonedTime } from "date-fns-tz";

import { OriginalData } from "./types";

export default async function Home() {
  const currentTimestamp = getTime(new Date());
  const currentTime = format(new Date(), "yyyy-MM-dd HH:mm:ss zzz");
  const currentTimeInUNIX = new Date();
  const JapanTimeString = formatInTimeZone(
    currentTimeInUNIX,
    "Asia/Tokyo",
    "yyyy-MM-dd HH:mm:ss"
  );
  const japanDate = utcToZonedTime(currentTimeInUNIX, "Asia/Tokyo");

  const url = `https://tokyo-haneda.com/app_resource/flight/data/int/hdacfdep.json?${currentTimestamp}`;
  const companyUrl =
    "https://tokyo-haneda.com/site_resource/flight/data/int/company_list_search.json";
  const citylist =
    "https://tokyo-haneda.com/site_resource/flight/data/int/city_list.json";

  const response = await fetch(url, {
    mode: "no-cors", // no-cors モードを設定
  });
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

  // 現在時刻以降のフライト情報のみをフィルタリング
  const futureFlights = processedData.filter((flight) => {
    // 現在の日時を取得
    const now = new Date();
    //'date-fns' を使用して日付を解析
    const scheduledTime = parse(
      flight.ScheduledTime.trim(),
      "yyyy/MM/dd HH:mm:ss",
      now
    );

    //出発済みフライトは除外
    return scheduledTime >= japanDate && flight.RemarksJP !== "出発済み";
  });

  return (
    <div>
      <div className="bg-gray-700 py-4 text-white border-b border-gray-400">
        更新時刻:{JapanTimeString}
        <br />
        現地時刻:{currentTime}
        <br />
        出発済みフライト・時刻を過ぎたフライトは除外
      </div>
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
            const ProcessedScheduledDate = format(parsedSchedule, "dd");

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
                  <br />
                  <p className="text-xs">{ProcessedScheduledDate}</p>
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
