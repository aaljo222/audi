import React, { useState } from "react";
import { addConcert } from "../../../api/adminApi";

const TicketAddComponent = () => {
  const [concert, setConcert] = useState({
    cname: "",
    cprice: "",
    cplace: "",
    cdesc: "",
    category: "",
    uploadFileName: null,
    schedulesDtoList: [
      {
        totalSeats: 100,
        startTime: "",
        endTime: "",
      },
    ],
  });

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 기본 정보 입력 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConcert((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 파일 업로드 처리
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setConcert((prev) => ({
        ...prev,
        uploadFileName: selectedFile.name,
      }));
    }
  };

  // 스케줄 추가 버튼
  const addSchedule = () => {
    setConcert((prev) => ({
      ...prev,
      schedulesDtoList: [
        ...prev.schedulesDtoList,
        {
          totalSeats: 100,
          startTime: "",
          endTime: "",
        },
      ],
    }));
  };

  // 스케줄 삭제 버튼
  const removeSchedule = (index) => {
    setConcert((prev) => ({
      ...prev,
      schedulesDtoList: prev.schedulesDtoList.filter((_, i) => i !== index),
    }));
  };

  // 스케줄 입력 처리
  const handleScheduleChange = (index, field, value) => {
    setConcert((prev) => {
      const updatedSchedules = [...prev.schedulesDtoList];
      updatedSchedules[index] = {
        ...updatedSchedules[index],
        [field]: value,
      };
      console.log(updatedSchedules);
      return {
        ...prev,
        schedulesDtoList: updatedSchedules,
      };
    });
  };

  // 날짜 포맷 함수 추가
  const formatDate = (dateString) => {
    if (!dateString) return null;
    // 이미 초가 포함되어 있는지 확인
    return dateString + ":00";
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 수정된 부분: new Date()를 사용하지 않고 문자열 그대로 사용하되 초만 추가
      const formattedConcert = {
        ...concert,
        schedulesDtoList: concert.schedulesDtoList.map((schedule) => ({
          ...schedule,
          startTime: formatDate(schedule.startTime),
          endTime: formatDate(schedule.endTime),
        })),
      };
      console.log(formattedConcert.schedulesDtoList);

      const formData = new FormData();

      // concertDTO를 JSON 문자열로 변환하여 FormData에 추가
      formData.append(
        "concertDTO",
        new Blob([JSON.stringify(formattedConcert)], {
          type: "application/json",
        })
      );

      // 파일이 있으면 FormData에 파일도 추가
      if (file) {
        formData.append("file", file);
      }

      // 기존 axios.post 직접 호출 대신 API 함수 사용
      await addConcert(formData);

      setSuccess("공연이 성공적으로 등록되었습니다!");
      // 폼 초기화
      setConcert({
        cname: "",
        cprice: "",
        cplace: "",
        cdesc: "",
        category: "",
        uploadFileName: null,
        schedulesDtoList: [
          {
            totalSeats: 100,
            startTime: "",
            endTime: "",
          },
        ],
      });
      setFile(null);
      setPreviewUrl("");
    } catch (err) {
      console.error("공연 등록 오류:", err);
      setError(
        "공연 등록 중 오류가 발생했습니다: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // 모든 필드 검증
  const validateForm = () => {
    if (
      !concert.cname ||
      !concert.cprice ||
      !concert.cplace ||
      !concert.cdesc ||
      !concert.category
    ) {
      return false;
    }

    // 모든 스케줄이 유효한지 확인
    for (const schedule of concert.schedulesDtoList) {
      if (!schedule.startTime || !schedule.endTime || !schedule.totalSeats) {
        return false;
      }
    }

    return true;
  };

  const categories = ["뮤지컬", "연극", "클래식", "콘서트", "기타"];

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* 상단 영역 - 2단 구조(좌: 이미지, 우: 기본 정보) */}
        <div className="flex flex-col md:flex-row">
          {/* 왼쪽 상단: 이미지 프리뷰 영역 - 너비 축소 */}
          <div className="w-full md:w-1/3 bg-white p-6 text-black">
            <div></div>
            <br />
            <br />

            <div className="flex flex-col items-center justify-center h-80 pt-7">
              {previewUrl ? (
                <div className="w-full flex justify-center">
                  <div className="bg-white w-50 h-80 rounded-xl  shadow-lg">
                    <img
                      src={previewUrl}
                      alt="포스터 미리보기"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-white w-60 h-80 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-orange-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-sm text-white text-center mt-4">
              {previewUrl
                ? "포스터 이미지 미리보기"
                : "공연 포스터 이미지를 업로드해주세요"}
            </p>
          </div>

          {/* 오른쪽 상단: 공연 기본 정보 입력 영역 - 너비 확대 */}
          <div className="w-full md:w-2/3 p-6 bg-white">
            <h3 className="text-2xl font-semibold text-gray-800 mb-5">
              공연 정보 입력
            </h3>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            <form>
              <div className="space-y-5">
                {/* 공연명 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    공연명
                  </label>
                  <input
                    type="text"
                    name="cname"
                    value={concert.cname}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="공연 이름을 입력하세요"
                    required
                  />
                </div>

                {/* 가격 및 카테고리 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      공연 가격
                    </label>
                    <input
                      type="text"
                      name="cprice"
                      value={concert.cprice}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      placeholder="예: 50,000원"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      카테고리
                    </label>
                    <select
                      name="category"
                      value={concert.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white"
                      required
                    >
                      <option value="">카테고리 선택</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 장소 및 이미지 업로드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      공연 장소
                    </label>
                    <input
                      type="text"
                      name="cplace"
                      value={concert.cplace}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      placeholder="공연 장소를 입력하세요"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      포스터 이미지
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                      />
                      <div className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-between text-gray-500">
                        <span className="truncate">
                          {concert.uploadFileName
                            ? concert.uploadFileName
                            : "이미지 파일 선택"}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 공연 설명 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    공연 설명
                  </label>
                  <textarea
                    name="cdesc"
                    value={concert.cdesc}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    rows="5"
                    placeholder="공연에 대한 설명을 입력하세요."
                    required
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* 하단 영역 - 스케줄 영역 (전체 가로폭 사용) */}
        <div className="w-full bg-white p-6 border-t border-gray-200 ">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">공연 스케줄</h3>
            <button
              type="button"
              onClick={addSchedule}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              스케줄 추가
            </button>
          </div>

          {concert.schedulesDtoList.map((schedule, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 mb-3 relative border border-gray-200 shadow-sm"
            >
              <button
                type="button"
                onClick={() => removeSchedule(index)}
                disabled={concert.schedulesDtoList.length === 1}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              <div className="mb-2">
                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  스케줄 #{index + 1}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    시작 시간
                  </label>
                  <input
                    type="datetime-local"
                    value={schedule.startTime}
                    onChange={(e) =>
                      handleScheduleChange(index, "startTime", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    종료 시간
                  </label>
                  <input
                    type="datetime-local"
                    value={schedule.endTime}
                    onChange={(e) =>
                      handleScheduleChange(index, "endTime", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    총 좌석 수
                  </label>
                  <input
                    type="number"
                    value={schedule.totalSeats}
                    onChange={(e) =>
                      handleScheduleChange(
                        index,
                        "totalSeats",
                        parseInt(e.target.value, 10)
                      )
                    }
                    min="1"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          {/* 등록 버튼 */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !validateForm()}
              className={`w-full ${
                validateForm()
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-gray-400"
              } text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {loading ? "등록 중..." : "공연 등록하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketAddComponent;
