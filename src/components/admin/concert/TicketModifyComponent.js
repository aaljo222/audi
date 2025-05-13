import { useEffect, useState } from "react";
import { getConcertByCno, modifyConcert } from "../../../api/adminApi"; // API 호출 함수 (가정)
import { useNavigate, useParams } from "react-router-dom";

const TicketModifyComponent = () => {
  const [concertData, setConcertData] = useState(null); // 초기값을 null로 설정
  const [file, setFile] = useState(null); // 파일 상태
  const [previewImageUrl, setPreviewImageUrl] = useState(""); // 미리보기 이미지 URL 상태 추가
  const [updatedConcertData, setUpdatedConcertData] = useState({
    cno: "", // cno 추가
    cname: "",
    cprice: "",
    cdesc: "",
    cplace: "",
    category: "",
    uploadFileName: "", // 이미지 파일명 추가
    schedulesDtoList: [],
  });
  const [deleteId, setDeleteId] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { cno } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getConcertByCno(cno)
      .then((data) => {
        setConcertData(data);
        // 스케줄 데이터에서 scheduleId 제거하고 나머지 정보만 사용
        console.log(data);
        const schedulesWithoutId =
          data.schedulesDtoList?.map((schedule) => ({
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            totalSeats: schedule.totalSeats,
            status: schedule.status,
            scheduleId: schedule.scheduleId,
          })) || [];

        setUpdatedConcertData({
          cno: data.cno, // cno 추가
          cname: data.cname,
          cprice: data.cprice,
          cdesc: data.cdesc,
          cplace: data.cplace,
          category: data.category || "",
          uploadFileName: data.uploadFileName || "", // 이미지 파일명 저장
          schedulesDtoList: schedulesWithoutId,
        });
        console.log(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("데이터 가져오기 실패:", error);
        setError("데이터 가져오기에 실패했습니다.");
        setLoading(false);
      });
  }, [cno]);

  // 컴포넌트 언마운트 시 메모리 정리
  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  // 폼 입력값 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedConcertData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (dateString) => {
    // '2025-03-27T20:00' -> '2025-03-27T20:00:00'
    return dateString + ":00"; // 초를 추가
  };

  // 파일 선택 처리 - 미리보기 기능 추가
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // 이전 미리보기 URL이 있으면 해제
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }

      // 새 미리보기 URL 생성
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreviewImageUrl(previewUrl);

      // 파일 이름 업데이트
      setUpdatedConcertData((prev) => ({
        ...prev,
        uploadFileName: selectedFile.name,
      }));
    }
  };

  // 스케줄 입력값 변경 처리
  const handleScheduleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSchedules = [...updatedConcertData.schedulesDtoList];
    if (name === "startTime" || name === "endTime") {
      // 날짜에 초를 추가하여 포맷을 맞추기
      updatedSchedules[index][name] = formatDate(value);
    } else {
      updatedSchedules[index][name] = value;
    }
    setUpdatedConcertData((prev) => ({
      ...prev,
      schedulesDtoList: updatedSchedules,
    }));
    console.log(updatedConcertData.schedulesDtoList);
  };

  // 새 스케줄 추가
  const handleAddSchedule = () => {
    setUpdatedConcertData((prev) => ({
      ...prev,
      schedulesDtoList: [
        ...prev.schedulesDtoList,
        {
          scheduleId: null,
          startTime: "",
          endTime: "",
          totalSeats: 100,
          status: "AVAILABLE",
        },
      ],
    }));
  };

  // 스케줄 삭제 기능 추가
  const handleDeleteSchedule = (index) => {
    const updatedSchedules = [...updatedConcertData.schedulesDtoList];
    const scheduleIdToDelete =
      updatedConcertData.schedulesDtoList[index].scheduleId;
    updatedSchedules.splice(index, 1); // 해당 인덱스의 스케줄 삭제
    setDeleteId((prev) => [...prev, scheduleIdToDelete]);
    setUpdatedConcertData((prev) => ({
      ...prev,
      schedulesDtoList: updatedSchedules,
    }));
  };

  // 폼 유효성 검사 함수
  const validateForm = () => {
    // 필수 입력 필드 검사
    if (
      !updatedConcertData.cname ||
      !updatedConcertData.cprice ||
      !updatedConcertData.cdesc ||
      !updatedConcertData.cplace ||
      !updatedConcertData.category
    ) {
      return false;
    }

    // 스케줄 존재 여부 검사
    if (updatedConcertData.schedulesDtoList.length === 0) {
      return false;
    }

    // 스케줄 데이터 유효성 검사
    for (const schedule of updatedConcertData.schedulesDtoList) {
      if (
        !schedule.startTime ||
        !schedule.endTime ||
        !schedule.totalSeats ||
        schedule.totalSeats <= 0 ||
        !schedule.status
      ) {
        return false;
      }
    }

    return true;
  };

  // 데이터 전송 함수 (API 호출)
  const handleSubmit = () => {
    // 입력 데이터 유효성 검사
    if (!validateForm()) {
      setError("모든 필수 정보를 입력해주세요.");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    // JSON 데이터를 BLOB으로 감싸서 FormData에 추가
    const concertDTO = new Blob([JSON.stringify(updatedConcertData)], {
      type: "application/json",
    });
    formData.append("concertDTO", concertDTO);
    formData.append("deleteId", JSON.stringify(deleteId));

    // 파일이 있다면 함께 추가
    if (file) {
      formData.append("file", file);
    }

    modifyConcert(formData)
      .then((response) => {
        setSuccess("공연이 성공적으로 수정되었습니다!");
        setTimeout(() => {
          navigate("/admin/concert/list");
        }, 1500);
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data || "요청 처리 중 오류가 발생했습니다.");
        } else {
          setError("요청 처리 중 오류가 발생했습니다.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const categories = ["뮤지컬", "연극", "클래식", "콘서트", "기타"];

  if (loading && !concertData) {
    return (
      <div className="w-full flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* 상단 영역 - 2단 구조(좌: 이미지, 우: 기본 정보) */}
        <div className="flex flex-col md:flex-row">
          {/* 왼쪽 상단: 이미지 프리뷰 영역 */}
          <div className="w-full md:w-1/3 bg-white p-6 text-black">
            <div></div>
            <br />
            <br />

            <div className="flex flex-col items-center justify-center h-80 pt-7">
              {previewImageUrl ? (
                <div className="w-full flex justify-center">
                  <div className="bg-white w-50 h-80 rounded-xl shadow-lg">
                    <img
                      src={previewImageUrl}
                      alt="포스터 미리보기"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              ) : updatedConcertData.uploadFileName ? (
                <div className="w-full flex justify-center">
                  <div className="bg-white w-50 h-80 rounded-xl shadow-lg">
                    <img
                      src={`http://localhost:8089/concert/view/s_${updatedConcertData.uploadFileName}`}
                      alt="현재 공연 이미지"
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
            <p className="text-sm text-gray-600 text-center mt-4">
              {previewImageUrl
                ? "새 포스터 이미지 미리보기"
                : updatedConcertData.uploadFileName
                ? "현재 포스터 이미지"
                : "공연 포스터 이미지를 업로드해주세요"}
            </p>
          </div>

          {/* 오른쪽 상단: 공연 기본 정보 입력 영역 */}
          <div className="w-full md:w-2/3 p-6 bg-white">
            <h3 className="text-2xl font-semibold text-gray-800 mb-5">
              공연 정보 수정
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
                    value={updatedConcertData.cname}
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
                      value={updatedConcertData.cprice}
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
                      value={updatedConcertData.category}
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
                      value={updatedConcertData.cplace}
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
                          {file
                            ? file.name
                            : updatedConcertData.uploadFileName
                            ? updatedConcertData.uploadFileName
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
                    value={updatedConcertData.cdesc}
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
        <div className="w-full bg-white p-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">공연 스케줄</h3>
            <button
              type="button"
              onClick={handleAddSchedule}
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

          {updatedConcertData.schedulesDtoList.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
              최소 하나 이상의 스케줄이 필요합니다.
            </div>
          ) : (
            updatedConcertData.schedulesDtoList.map((schedule, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 mb-3 relative border border-gray-200 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => handleDeleteSchedule(index)}
                  disabled={updatedConcertData.schedulesDtoList.length === 1}
                  className={`absolute top-2 right-2 text-gray-500 hover:text-red-600 transition-colors duration-200 ${
                    updatedConcertData.schedulesDtoList.length === 1
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      시작 시간
                    </label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={schedule.startTime.replace(":00", "")}
                      onChange={(e) => handleScheduleChange(index, e)}
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
                      name="endTime"
                      value={schedule.endTime.replace(":00", "")}
                      onChange={(e) => handleScheduleChange(index, e)}
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
                      name="totalSeats"
                      value={schedule.totalSeats}
                      onChange={(e) =>
                        handleScheduleChange(index, {
                          target: {
                            name: "totalSeats",
                            value: parseInt(e.target.value, 10),
                          },
                        })
                      }
                      min="1"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      상태
                    </label>
                    <select
                      name="status"
                      value={schedule.status}
                      onChange={(e) => handleScheduleChange(index, e)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white"
                      required
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="SOLD_OUT">SOLD_OUT</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}

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
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  수정 중...
                </>
              ) : (
                <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  공연 정보 수정하기
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModifyComponent;
