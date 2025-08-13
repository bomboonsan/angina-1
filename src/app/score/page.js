'use client';
import { useCookies } from 'next-client-cookies';
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import LangSwitch from "@/components/LangSwitch";
import Swal from 'sweetalert2';

// Google Font Kanit
import { Kanit } from 'next/font/google';

const kanit = Kanit({
    subsets: ['latin', 'thai'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    display: 'swap',
});

export default function Score() {
  const [agent, setAgent] = useState('');
  const [lang, setLang] = useState("th");
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const cookies = useCookies();
  const [step, setStep] = useState(1);

    const agentUpperCase = (value) => {
        setAgent(value.toUpperCase());
    }
  
    useEffect(() => {
    const lang = cookies.get("lang");
    if (lang) {
      // setLang(lang);
      setLang("th");

    } else {
      setLang("th");
    }
    }, []);
  
  const sendLang = (value) => {
    setLang(value);
  };

    const validateForm = () => {
      const newErrors = {};
      
      if (!agent) {
        newErrors.agent = lang === "th" ? 'กรุณาเลือก Agent' : 'Please enter Agent ID';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (validateForm()) {
        Swal.fire({
          icon: "warning",
          title: lang === "th" ? "คุณต้องการบันทึกคะแนนนี้หรือไม่?" : "Do you want to submit this score?",
          text: `${lang === "th" ? "รหัสผู้แทน" : "Agent ID"}: ${agent}`,
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: lang === "th" ? "บันทึก" : "Submit",
          cancelButtonText: lang === "th" ? "ยกเลิก" : "Cancel",
          confirmButtonColor: "#25215f",
        }).then(async (result) => {
          if (result.isConfirmed) {
          try {
            // Validate env
            const baseUrl =
              process.env.NEXT_PUBLIC_API_URL ||
              "https://dint.wish-integrate.com";
            const apiKey =
              process.env.NEXT_PUBLIC_API_KEY || "WMLKASDJKLQWEUIO";
            if (!baseUrl || !apiKey) {
              Swal.fire({
                icon: 'error',
                title: lang === "th" ? 'การตั้งค่าไม่ถูกต้อง' : 'Invalid configuration',
                text: lang === "th"
                  ? 'กรุณาตรวจสอบ NEXT_PUBLIC_API_URL และ NEXT_PUBLIC_API_KEY ใน .env.local'
                  : 'Please check NEXT_PUBLIC_API_URL and NEXT_PUBLIC_API_KEY in .env.local',
                confirmButtonColor: '#25215f'
              });
              return;
            }

            // Show loading
            Swal.fire({
              title: lang === "th" ? 'กำลังบันทึกข้อมูล...' : 'Saving...',
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              }
            });

            // Submit to external API (Create agent)
            const endpoint = `${baseUrl.replace(/\/$/, '')}/api/agents`;
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
              },
              body: JSON.stringify({ agent_code: agent })
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
              Swal.fire({
                icon: 'success',
                title: lang === "th" ? 'บันทึกข้อมูลสำเร็จ!' : 'Saved successfully!',
                text: `${lang === "th" ? "รหัสผู้แทน" : "Agent ID"}: ${data.agent_code || agent} ${lang === "th" ? "ได้รับการบันทึกแล้ว" : "has been saved"}`,
                confirmButtonColor: '#25215f',
                timer: 2500
              }).then(() => {
                handleReset();
                // router.push('/'); // Navigate back to the previous page
                window.close();
              });
            } else {
              let errorMessage = lang === "th"
                ? 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
                : 'An error occurred while saving data';

              if (response.status === 401 || response.status === 403) {
                errorMessage = lang === "th"
                  ? 'รหัส API ไม่ถูกต้อง หรือไม่มีสิทธิ์เข้าถึง'
                  : 'Invalid API key or unauthorized access';
              } else if (response.status === 400) {
                errorMessage = lang === "th"
                  ? 'ข้อมูลที่ส่งไม่ถูกต้อง'
                  : 'Invalid submitted data';
              } else if (data && data.error) {
                errorMessage = data.error;
              }

              Swal.fire({
                icon: 'error',
                title: lang === "th" ? 'เกิดข้อผิดพลาด' : 'Error',
                text: errorMessage,
                confirmButtonColor: '#25215f'
              });
            }
          } catch (error) {
            console.error('Submit error:', error);
            Swal.fire({
              icon: 'error',
              title: lang === "th" ? 'เกิดข้อผิดพลาด' : 'Error',
              text: lang === "th"
                ? 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'
                : 'Cannot connect to server',
              confirmButtonColor: '#25215f'
            });
          }
          } else {
          // Canceled
          }
        });
      }
    };

    const handleReset = () => {
        setAgent('');
        setErrors({});
    };
  
    const handleLike = () => {
        setStep(2);
    };
    const handleDislike = () => {
        router.push("/start");
    };

    return (
      <div
        className={`app-wrapper min-h-screen bg-gradient-to-b from-gray-50 to-white ${kanit.className} max-w-[500px] mx-auto bg-white shadow min-h-screen overflow-hidden app-wrapper relative`}
      >
        <Header />
        <LangSwitch props={{ sendLang: sendLang }} />

        <div
          className={`container mx-auto px-4 py-8 ${
            step == 1 ? "block" : "hidden"
          }`}
        >
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-primary text-center">
                  {lang === "th"
                    ? "คุณชอบแอปพลิเคชันนี้หรือไม่?"
                    : "Do you like this application?"}
                </h2>
              </div>
              <div className="flex gap-12 justify-center mb-8">
                <button
                  type="button"
                  aria-label={lang === "th" ? "ชอบ" : "Like"}
                  className={`border border-primary/10 transition-all duration-150 cursor-pointer p-10 rounded-xl bg-neutral-100 shadow hover:shadow-lg hover:scale-[1.03] hover:bg-primary/5 hover:text-white ${
                    agent === "LIKE"
                      ? "bg-green-100 border-green-500 scale-110"
                      : "bg-white border-gray-300 hover:border-green-400"
                  }`}
                  onClick={() => handleLike()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`w-20 h-20 ${
                      agent === "DISLIKE" ? "text-green-500" : "text-primary"
                    }`}
                  >
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label={lang === "th" ? "ไม่ชอบ" : "Dislike"}
                  className={`border border-primary/10 transition-all duration-150 cursor-pointer p-10 rounded-xl bg-neutral-100 shadow hover:shadow-lg hover:scale-[1.03] hover:bg-primary/5 hover:text-white ${
                    agent === "DISLIKE"
                      ? "bg-red-100 border-red-500 scale-110"
                      : "bg-white border-gray-300 hover:border-red-400"
                  }`}
                  onClick={() => handleDislike()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`w-20 h-20 ${
                      agent === "DISLIKE" ? "text-red-500" : "text-primary"
                    }`}
                  >
                    <path d="M17 14V2" />
                    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`container mx-auto px-4 py-8 ${
            step == 2 ? "block" : "hidden"
          }`}
        >
          <div className="max-w-2xl mx-auto">
            {/* Page Title */}
            <div className="text-center mb-8 hidden">
              {lang === "th" ? (
                <h1 className="text-3xl font-bold text-primary mb-2">
                  ให้กำลังใจผู้แทนของท่าน
                  <br />
                  โดยการให้คะแนน
                </h1>
              ) : (
                <h1 className="text-3xl font-bold text-primary mb-2">
                  Support Your Agent
                  <br />
                  By Giving a Score
                </h1>
              )}
            </div>

            {/* Score Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="bg-primary text-white p-6">
                <h2 className="text-xl font-semibold text-center hidden">
                  {lang === "th" ? "แบบฟอร์มการให้คะแนน" : "Score Form"}
                </h2>
                <h1 className="text-2xl font-bold text-white text-center mb-2">
                  {lang === "th" ? (
                    <span>ให้คะแนนผู้แนะนำ</span>
                  ) : (
                    <span>Rate Your Agent</span>
                  )}
                </h1>
              </div>

              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Agent Select */}
                  <div>
                    <label className="label">
                      <span className="label-text text-lg font-medium text-gray-700">
                        {lang === "th" ? "รหัสผู้แทน" : "Agent ID"}{" "}
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={agent}
                        onChange={(e) => agentUpperCase(e.target.value)}
                        className={`input input-bordered w-full text-lg ${
                          errors.agent ? "input-error" : "focus:input-primary"
                        }`}
                      />
                    </div>
                    {errors.agent && (
                      <div className="label">
                        <span className="label-text-alt text-error">
                          {errors.agent}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="btn btn-primary flex-1 text-lg"
                      disabled={!agent}
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {lang === "th" ? " บันทึกคะแนน" : "Submit"}
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn btn-outline btn-secondary hidden"
                      disabled={!agent}
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      รีเซ็ต
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Information Card */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hidden2">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-yellow-500 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                {lang === "th" ? (
                  <div>
                    <h3 className="font-medium text-yellow-900 mb-1">
                      หมายเหตุ
                    </h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>
                        สามารถให้คะแนนได้เพียงหนึ่งครั้ง{" "}
                        <span className="font-medium">
                          โปรดสอบถามตัวแทนของท่าน
                        </span>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-medium text-yellow-900 mb-1">Note</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>
                        You can only score once{" "}
                        <span className="font-medium">
                          Please ask your agent
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}