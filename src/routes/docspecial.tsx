import { createFileRoute } from "@tanstack/react-router";
import { Nb } from "@/components/chrome";
import { Photo, Shell, SourceNote, SubHero, pageHead } from "@/components/layout";
import { DepositTable, SourceLine } from "@/components/role";
import { SPECIAL_CAPS, img } from "@/data/content";

export const Route = createFileRoute("/docspecial")({
  head: () => pageHead("특별공급 안내"),
  component: Page,
});

const RULES = [
  "주택 소유: 세대 구성원 무주택. 출산특례의 기존주택 처분 조건이면 다자녀·신혼부부·노부모·신생아는 예외로 적힘.",
  "지역: 해당지역 인천시 거주자, 기타지역 수도권(서울, 경기도) 거주자.",
  "무주택: 대부분 무주택세대구성원. 노부모만 무주택세대주.",
  "기본 자격은 유형마다 다릅니다. 신혼은 혼인 7년 이내, 생애최초는 세대원 전원 주택 소유 사실 없음과 5년 이상 소득세 납부, 신생아는 2세 미만 자녀(태아 포함), 노부모는 만 65세 이상 직계존속 3년 이상 부양으로 적혀 있습니다.",
  "신혼·생애최초·신생아의 부동산 가액은 약 3.31억원 이하(토지 공시지가, 건축물 시가표준액, 전세보증금 제외). 기관추천·경제자유구역·다자녀·노부모의 소득·자산 칸은 「-」입니다.",
  "통장: 앞 네 유형은 가입 6개월(기관추천의 장애인·국가유공자 등 제외), 신혼·생애최초·신생아는 12개월. 예치금은 아래 표.",
];

function Page() {
  return (
    <Shell>
      <SubHero en="INFORMATION" title="특별공급 안내" crumbs="청약안내 / 특별공급 안내" />
      <article className="ak-wrap ak-page">
        <div className="ak-cols">
          <h2 className="ak-h2">공급 비율과 적용 타입</h2>
          <div className="ak-stack">
            <div>
              <table className="ak-tbl">
                <thead>
                  <tr>
                    <th scope="col">유형</th>
                    <th scope="col">비율</th>
                    <th scope="col">적용 타입</th>
                  </tr>
                </thead>
                <tbody>
                  {SPECIAL_CAPS.map(([name, cap, types]) => (
                    <tr key={name}>
                      <th scope="row">{name}</th>
                      <td>{cap}</td>
                      <td>
                        <Nb>{types}</Nb>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <SourceLine
                items={[
                  { k: "출처", v: "사업주체 공개자료" },
                  { k: "우선 기준", v: "입주자모집공고" },
                ]}
              />
            </div>
            <ul className="ak-list">
              {RULES.map((rule) => (
                <li key={rule}>
                  <Nb>{rule}</Nb>
                </li>
              ))}
            </ul>
            <DepositTable />
            {/* 세로로 긴 공식 안내 이미지는 본문 뒤에 접어 둔다 */}
            <details className="ak-details">
              <summary>공식 안내 이미지 보기</summary>
              <div className="ak-details__body">
                <Photo
                  src={img("/resources/img/sub/03_특별공급.v4.jpg")}
                  alt="특별공급 안내"
                  className="w-full"
                />
              </div>
            </details>
          </div>
        </div>
      </article>
      <SourceNote />
    </Shell>
  );
}
