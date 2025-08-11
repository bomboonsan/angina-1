"use client";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import Header from "@/components/Header";
import LangSwitch from "@/components/LangSwitch";
import Title from "@/components/Title";
import AgeSex from "@/components/AgeSex";
import Question from "@/components/Question";
import QuestionList from "@/components/QuestionList";
import Skeleton from "@/components/Skeleton";
import Result from "@/components/Result";
import SymptomSection from "@/components/SymptomSection";

import { useEffect, useState } from "react";

import pageTitle from "@/data/pageTitle.json";
import questionTitle from "@/data/questionTitle.json";
import questionTitleSection1_1 from "@/data/questionTitleSection1_1.json";
import questionTitleSection1_2 from "@/data/questionTitleSection1_2.json";
import questionTitleSection2 from "@/data/questionTitleSection2.json";

import questionTitleSection1_1_en from "@/data/questionTitleSection1_1_en.json";
import questionTitleSection1_2_en from "@/data/questionTitleSection1_2_en.json";
import questionTitleSection2_en from "@/data/questionTitleSection2_en.json";

export default function Home() {
  const cookies = useCookies();
  const [stateSection, setStateSection] = useState({
    start: true,
    symptom: false,
    questionSection_1_1: false,
    questionSection_1_2: false,
    questionSection_2: false,
    showResult: false,
  });
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [symptomSectionSelected, setSymptomSectionSelected] = useState(null);
  const [sex, setSex] = useState(null);
  const [age, setage] = useState(null);
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [score, setScore] = useState([
    {
      score: null,
    },
    {
      score: null,
    },
    {
      score: null,
    },
    {
      score: null,
    },
    {
      score: null,
    },
    {
      score: null,
    },
    {
      score: null,
    },
    {
      score: null,
    },
    {
      score: null,
    },
  ]);
  const [totalScore, setTotalScore] = useState(0);
  const [totalScore2, setTotalScore2] = useState(0);
  const sendLang = (value) => {
    setLang(value);
  };
  const saveScore = (value) => {
    // score[step].score = value;
    // setScore(score);
    if (stateSection.questionSection_2) {
      setTotalScore2(totalScore2 + value);
    } else {
      setTotalScore(totalScore + value);
    }
    nextStep();
  };
  const saveCookies = (value) => {
    if (stateSection.questionSection_2) {
      console.log("Section1", value);
      cookies.set("Section1", value);
    } else {
      // console.log('Section2' , value);
      cookies.set("Section2", value);
    }
  };
  const saveInfo = (age, sex, start) => {
    let state = stateSection;
    state.start = false;
    state.symptom = true;
    setStateSection(state);

    setSex(sex);
    setage(age);
    cookies.set("sex", sex);
    cookies.set("age", age);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  const saveSymptom = (symptom) => {
    let state = stateSection;
    setTotalScore(0);

    setSymptomSectionSelected(symptom);
    if (symptom == "option1") {
      setMaxStep(3);
      state.symptom = false;
      state.questionSection_1_1 = true;
      setStateSection(state);
    } else {
      setMaxStep(1);
      state.symptom = false;
      state.questionSection_1_2 = true;
      setStateSection(state);
    }
  };
  const nextStep = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    if (!stateSection.questionSection_2) {
      // Show Section 2
      let state = stateSection;
      state.questionSection_1_1 = false;
      state.questionSection_1_2 = false;
      state.questionSection_2 = true;
      setStateSection(state);

      setMaxStep(5);
      setStep(0);

      return;
    }

    if (stateSection.questionSection_2) {
      // Show Result
      let state = stateSection;
      state.questionSection_2 = false;
      state.showResult = true;
      setStateSection(state);

      return;
    }
    // setStep(step + 1);
  };
  const calculateScore = () => {
    let total = 0;
    score.forEach((element) => {
      total += element.score;
    });
    return total;
  };
  const getResultData = () => {
    const level = [
      "ความเสี่ยงต่ำมาก",
      "ความเสี่ยงต่ำ",
      "ความเสี่ยงปลายกลาง",
      "ความเสี่ยงสูง",
    ];
    if (calculateScore() <= 7) {
      return level[0];
    } else if (calculateScore() > 7 && calculateScore() <= 14) {
      return level[1];
    } else if (calculateScore() > 14 && calculateScore() <= 21) {
      return level[2];
    } else if (calculateScore() > 21) {
      return level[3];
    }
  };

  useEffect(() => {
    cookies.remove("lang");
    cookies.remove("sex");
    cookies.remove("age");
    cookies.remove("RF_PTP");
    cookies.remove("CACS");
    cookies.remove("Section1");
    cookies.remove("Section2");
  }, []);
  useEffect(() => {
    cookies.set("lang", lang);
  }, [lang]);

  console.log("totalScore1", totalScore);
  console.log("totalScore2", totalScore2);

  return (
    <>
      <main className="max-w-[500px] mx-auto bg-white shadow min-h-screen overflow-hidden app-wrapper relative">
        <Header />
        <div className="my-5 p-4">
          <LangSwitch props={{ sendLang: sendLang }} />

          {stateSection.start && (
            <AgeSex props={{ sendData: saveInfo, lang: lang }} />
          )}

          {stateSection.symptom && (
            <SymptomSection props={{ sendData: saveSymptom, lang: lang }} />
          )}

          {stateSection.questionSection_1_1 && (
            <>
              <progress
                className="progress progress-primary w-full"
                value={`${(step / 9) * 100}`}
                max="100"
              ></progress>

              {lang == "en" ? (
                <>
                  <Title props={{ title: "Chest pain characteristics" }} />
                </>
              ) : (
                <>
                  <Title props={{ title: "ลักษณะของอาการเจ็บหน้าอก" }} />
                </>
              )}

              {loading && <Skeleton />}
              {!loading && lang == "en" && (
                <QuestionList
                  props={{
                    sendData: saveScore,
                    sendCookie: saveCookies,
                    questions: questionTitleSection1_1_en,
                    lang: lang,
                  }}
                />
              )}
              {!loading && lang == "th" && (
                <QuestionList
                  props={{
                    sendData: saveScore,
                    sendCookie: saveCookies,
                    questions: questionTitleSection1_1,
                    lang: lang,
                  }}
                />
              )}
            </>
          )}

          {stateSection.questionSection_1_2 && (
            <>
              <progress
                className="progress progress-primary w-full"
                value={`${(step / 9) * 100}`}
                max="100"
              ></progress>

              {lang == "en" ? (
                <>
                  <Title props={{ title: "Dyspnoea characteristics" }} />
                </>
              ) : (
                <>
                  <Title props={{ title: "ลักษณะการหายใจลำบาก" }} />
                </>
              )}

              {loading && <Skeleton />}
              {/* {!loading && 
                    <Question props={{ sendData: saveScore , point : questionTitleSection1_2[step].point }}>
                        <span dangerouslySetInnerHTML={{ __html: questionTitleSection1_2[step].text }} />
                    </Question>
                    } */}
              {!loading && lang == "en" && (
                <QuestionList
                  props={{
                    sendData: saveScore,
                    sendCookie: saveCookies,
                    questions: questionTitleSection1_2_en,
                    lang: lang,
                  }}
                />
              )}
              {!loading && lang == "th" && (
                <QuestionList
                  props={{
                    sendData: saveScore,
                    sendCookie: saveCookies,
                    questions: questionTitleSection1_2,
                    lang: lang,
                  }}
                />
              )}
            </>
          )}

          {stateSection.questionSection_2 && (
            <>
              <progress
                className="progress progress-primary w-full"
                value={`${(step / 9) * 100}`}
                max="100"
              ></progress>

              {lang == "en" ? (
                <>
                  <Title props={{ title: "Risk Factors for CAD" }} />
                </>
              ) : (
                <>
                  <Title props={{ title: "ข้อมูลส่วนตัว" }} />
                </>
              )}

              {loading && <Skeleton />}
              {!loading && lang == "en" && (
                <QuestionList
                  props={{
                    sendData: saveScore,
                    sendCookie: saveCookies,
                    questions: questionTitleSection2_en,
                    lang: lang,
                  }}
                />
              )}
              {!loading && lang == "th" && (
                <QuestionList
                  props={{
                    sendData: saveScore,
                    sendCookie: saveCookies,
                    questions: questionTitleSection2,
                    lang: lang,
                  }}
                />
              )}
            </>
          )}

          {stateSection.showResult && (
            <Result
              props={{
                point1: totalScore,
                point2: totalScore2,
                text: getResultData(),
                sex: sex,
                age: age,
                lang: lang,
              }}
            />
          )}
        </div>
      </main>
    </>
  );
}
