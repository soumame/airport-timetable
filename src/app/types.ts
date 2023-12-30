interface Airline {
  ＡＬコード: string;
  ＡＬ和名称: string;
  ＡＬ英名称: string;
  便名: string;
}

interface Translation {
  ja: string;
  en: string;
  ko: string;
  "zh-Hans": string;
  "zh-Hant": string;
}

interface FlightInfo {
  航空会社: Airline[];
  行先地空港コード: string;
  行先地空港和名称: string;
  行先地空港英名称: string;
  行先地方面コード: string;
  行先地方面和名称: string;
  行先地方面英名称: string;
  経由地空港コード: string;
  経由地空港和名称: string;
  経由地空港英名称: string;
  経由地方面コード: string;
  経由地方面和名称: string;
  経由地方面英名称: string;
  定刻: string;
  変更時刻: string;
  ターミナル区分: string;
  ウイング区分: string;
  備考和名称: string;
  備考英名称: string;
  備考訳名称: Translation;
  フリッカ: string;
  ゲート番号コード: string;
  ゲート和名称: string;
  ゲート英名称: string;
  備考コード: string;
  チェックインカウンター番号: string;
  機種コード: string;
  運航状態: string;
}

export interface OriginalData {
  flight_info: FlightInfo[];
}
