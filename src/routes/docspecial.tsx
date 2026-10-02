import { createFileRoute } from "@tanstack/react-router";
import { Photo, Shell, SourceNote, SubHero, pageHead } from "@/components/layout";
import { DEPOSIT, SPECIAL_CAPS, img } from "@/data/content";

export const Route = createFileRoute("/docspecial")({
  head: () => pageHead("특별공급 안내"),
  component: Page,
});

function Page() {
  return (
    <Shell>
      <SubHero en="INFORMATION" title="특별공급 안내" crumbs="청약안내 / 특별공급 안내" />
      <article className="mx-auto max-w-6xl px-4 py-12">
        <Photo src={img("/resources/img/sub/03_특별공급.v4.jpg")} alt="특별공급 안내" className="w-full" />
        <h2 className="mt-12 font-serif text-2xl">공급 비율과 적용 타입</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink text-left">
                <th className="py-3 font-medium">유형</th>
                <th className="py-3 font-medium">비율</th>
                <th className="py-3 font-medium">적용 타입</th>
              </tr>
            </thead>
            <tbody>
              {SPECIAL_CAPS.map(([name, cap, types]) => (
                <tr key={name} className="border-b border-line">
                  <td className="py-3">{name}</td>
                  <td className="py-3">{cap}</td>
                  <td className="py-3">{types}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-8 space-y-3 text-sm leading-6">
          <li>주택 소유: 세대 구성원 무주택. 출산특례의 기존주택 처분 조건이면 다자녀·신혼부부·노부모·신생아는 예외로 적힘.</li>
          <li>지역: 해당지역 인천시 거주자, 기타지역 수도권(서울, 경기도) 거주자.</li>
          <li>무주택: 대부분 무주택세대구성원. 노부모만 무주택세대주.</li>
          <li>기본 자격은 유형마다 다릅니다. 신혼은 혼인 7년 이내, 생애최초는 세대원 전원 주택 소유 사실 없음과 5년 이상 소득세 납부, 신생아는 2세 미만 자녀(태아 포함), 노부모는 만 65세 이상 직계존속 3년 이상 부양으로 적혀 있습니다.</li>
          <li>신혼·생애최초·신생아의 부동산 가액은 약 3.31억원 이하(토지 공시지가, 건축물 시가표준액, 전세보증금 제외). 기관추천·경제자유구역·다자녀·노부모의 소득·자산 칸은 「-」입니다.</li>
          <li>통장: 앞 네 유형은 가입 6개월(기관추천의 장애인·국가유공자 등 제외), 신혼·생애최초·신생아는 12개월. 예치금은 아래 표.</li>
        </ul>
        <DepositTable />
      </article>
      <SourceNote />
    </Shell>
  );
}

export function DepositTable() {
  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-sm">
        <caption className="mb-3 text-left font-serif text-2xl">청약 예치금액</caption>
        <thead>
          <tr className="border-b border-ink text-left">
            <th className="py-3 font-medium">면적</th>
            <th className="py-3 font-medium">인천</th>
            <th className="py-3 font-medium">서울</th>
            <th className="py-3 font-medium">경기</th>
          </tr>
        </thead>
        <tbody>
          {DEPOSIT.map(([area, incheon, seoul, gyeonggi]) => (
            <tr key={area} className="border-b border-line">
              <td className="py-3">{area}</td>
              <td className="py-3">{incheon}</td>
              <td className="py-3">{seoul}</td>
              <td className="py-3">{gyeonggi}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-sm text-muted">청라 아크원 푸르지오 적용 타입 기준.</p>
    </div>
  );
}
