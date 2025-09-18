import React, { use, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/Input/Input";
import styles from "./SigninPage.module.css";
import Checkbox from "../../components/Checkbox/Checkbox";
import Modal from "../../components/PolicyModal/PolicyModal";

function Signin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "", // 유저이름
    userEmail: "", // 이메일
    userPw: "", // 비밀번호
    confirmPw: "", // 재확인
    agreeTerms: false, // 서비스 이용약관
    agreePrivacy: false, // 개인정보처리방침
    userFile: null, // 프로필사진?
  });

  const [errors, setErrors] = useState({
    // 유효성 검사용
    userName: "",
    userEmail: "",
    userPw: "",
    confirmPw: "",
  });

  const [isFormVaild, setIsFormVaild] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return regex.test(password);
  };

  const handleEmailVerification = async () => {
    alert("이메일 인증 요청이 전송되었습니다.");
    // 이메일 인증 로직 추가
    try {
      const res = await fetch("https://43.203.7.11:8080/valid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({ email: formData.userEmail }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        alert(
          "이메일 인증 요청에 실패했습니다: " + (data.message || "오류 발생")
        );
        return;
      }

      alert("인증 메일이 전송되었습니다. 메일함을 확인해주세요.");
    } catch (error) {
      console.error("이메일 인증 요청 오류:", error);
      alert("서버 연결 중 문제가 발생했습니다.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // 실시간 유효성 검사
    setErrors((prev) => {
      const newErrors = { ...prev };
      const trimmedValue = value.trim();

      switch (name) {
        case "userName":
          newErrors.userName =
            trimmedValue.length > 20 ? "이름은 20자 이내로 입력해주세요." : "";
          break;

        case "userEmail":
          newErrors.userEmail =
            trimmedValue && !validateEmail(value)
              ? "유효한 이메일 형식이 아닙니다."
              : "";
          break;

        case "userPw":
          newErrors.userPw =
            trimmedValue && !validatePassword(value)
              ? "영어, 숫자, 특수문자를 포함하여 8~20자로 입력해주세요."
              : "";
          break;

        case "confirmPw":
          newErrors.confirmPw =
            trimmedValue && value !== formData.userPw
              ? "비밀번호가 일치하지 않습니다."
              : "";
          break;
      }

      return newErrors;
    });
  };

  // 회원가입 폼 유효성 검사
  useEffect(() => {
    const isUsernameValid =
      formData.userName.trim() !== "" &&
      formData.userName.length <= 20 &&
      formData.userName.length > 0;

    const isUserEmailValid =
      formData.userEmail.trim() !== "" && validateEmail(formData.userEmail);

    const isUserPwValid =
      formData.userPw.trim() !== "" && validatePassword(formData.userPw);

    const isConfirmPwValid =
      formData.confirmPw.trim() !== "" &&
      formData.confirmPw === formData.userPw;
    const isAgreementsValid = formData.agreeTerms && formData.agreePrivacy;

    setIsFormVaild(
      isUsernameValid &&
        isUserEmailValid &&
        isUserPwValid &&
        isConfirmPwValid &&
        isAgreementsValid
    );
  }, [formData]);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!isFormVaild) {
      // 버튼 비활성화
      alert("양식에 맞지 않습니다.");
      return;
    }

    console.log("회원가입 데이터:", formData);
    // 회원가입 처리 로직
    try {
      const form = new FormData();
      form.append("name", formData.userName);
      form.append("email", formData.userEmail);
      form.append("password", formData.userPw);
      if (formData.userFile) form.append("file", formData.userFile);

      const response = await fetch("https://43.203.7.11:8080/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          name: formData.userName,
          file: "file", // 파일 업로드 기능 추가 시 수정 필요
          email: formData.userEmail,
          password: formData.userPw,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        alert("회원가입에 실패했습니다: " + (data.message || "오류 발생"));
        return;
      }

      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate("/login"); // 가입 후 이동할 경로
    } catch (err) {
      console.error("회원가입 요청 실패:", err);
      alert("서버에 연결할 수 없습니다.");
    }
  };

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    content: "",
  });

  const openModal = (title, content) => {
    setModalState({ isOpen: true, title, content });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: "", content: "" });
  };
  const termsOfService = `서울식(Seoul Seek) 서비스 이용약관

제1장 총칙

제1조 (목적)
본 약관은 서우리(이하 "회사")가 제공하는 역사 관광 컨텐츠 제공 웹서비스 '서울식(Seoul Seek)'(이하 "서비스")의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"란 이용자가 서울시 역사 관광지에 대한 정보를 조회하고 직접 정보를 등록할 수 있는 온라인 체험형 관광 플랫폼을 의미합니다.
2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원을 말합니다.
3. "회원"이란 서비스에 카카오 계정 또는 직접 회원가입을 통해 서비스를 이용하는 자를 말합니다.

제3조 (약관의 효력 및 변경)
1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.
2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.
3. 약관이 변경된 경우에는 지체 없이 이를 공지합니다.

제2장 서비스 이용

제4조 (서비스 이용 계약의 성립)
1. 서비스 이용 계약은 만 14세 이상의 이용자가 카카오 계정을 통해 로그인하고 본 약관에 동의함으로써 성립됩니다.
2. 회사는 다음 각 호에 해당하는 경우 서비스 이용을 제한할 수 있습니다:
   - 만 14세 미만인 경우
   - 타인의 계정을 도용한 경우
   - 서비스의 운영을 고의로 방해한 경우
   - 불법적인 목적으로 서비스를 이용한 경우

제5조 (서비스의 제공 및 변경)
1. 회사는 다음과 같은 서비스를 제공합니다:
   - 주제별 관광 '코스' 정보 조회 및 검색
   - 서울시 자치구별 역사 명소에 대한 상세 정보 조회
   - 역사 명소별 '방명록' 등록 및 조회
   - 지도 기반 역사 명소 위치 확인 및 검색
   - 역사 시대별 지도 비교 및 조회
   - 개인 프로필 관리 및 활동 내역 조회
2. 회사는 서비스의 내용을 변경하거나 중단할 수 있으며, 이 경우 변경 또는 중단됨을 사전에 공지합니다.

제6조 (이용자의 의무)
1. 이용자는 서비스 이용 시 관련 법령과 본 약관을 준수해야 합니다.
2. 이용자는 타인의 권리를 침해하거나 공공질서에 반하는 행위를 하여서는 안 됩니다.
3. 이용자는 방명록 등록 시 허위 정보나 부적절한 내용을 게시해서는 안 됩니다.

제7조 (면책조항)
회사는 천재지변, 시스템 장애 등 불가항력적 사유로 인한 서비스 중단에 대하여 책임을 지지 않습니다.

시행일자: 2025년 9월 1일`;

  const privacyPolicy = `서울식(Seoul Seek) 개인정보 처리방침

제1조 (개인정보의 처리목적)
서울식은 다음의 목적을 위하여 개인정보를 처리합니다.
1. 서비스 제공 및 회원관리
2. 맞춤형 서비스 제공
3. 서비스 개선 및 통계 분석

제2조 (처리하는 개인정보의 항목)
1. 필수항목: 이름, 이메일 주소
2. 선택항목: 프로필 사진, 관심 지역
3. 자동수집항목: 접속 로그, 쿠키, 서비스 이용기록

제3조 (개인정보의 처리 및 보유기간)
1. 회원 탈퇴 시까지 보유하며, 탈퇴 후 즉시 삭제합니다.
2. 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.

제4조 (개인정보의 제3자 제공)
회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 단, 다음의 경우는 예외로 합니다.
1. 이용자가 사전에 동의한 경우
2. 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

제5조 (개인정보의 안전성 확보조치)
회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
1. 관리적 조치: 내부관리계획 수립, 직원 교육
2. 기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치
3. 물리적 조치: 전산실, 자료보관실 등의 접근통제

제6조 (개인정보 보호책임자)
개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제를 처리하기 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.

▶ 개인정보 보호책임자
성명: 서우리
연락처:

본 방침은 2025년 9월 1일부터 시행됩니다.`;

  return (
    <>
      <AuthLayout title="회원가입">
        <form onSubmit={handleSignup} className={styles.form}>
          <div className={styles.login_box}>
            <Input
              type="text"
              placeholder="닉네임을 입력해 주세요 (최대 20자)"
              value={formData.userName}
              onChange={handleChange}
              name="userName"
            />
            <div className={styles.errorMessagesWrap}>
              {errors.userName && (
                <p className={styles.errorMessages}>{errors.userName}</p>
              )}
            </div>

            <Input
              type="email"
              placeholder="사용하실 이메일 주소를 입력해 주세요"
              value={formData.userEmail}
              onChange={handleChange}
              name="userEmail"
              verifyButton={true}
              onVerifyButtonClick={handleEmailVerification}
            />
            <div className={styles.errorMessagesWrap}>
              {errors.userEmail && (
                <p className={styles.errorMessages}>{errors.userEmail}</p>
              )}
            </div>

            <Input
              type="password"
              placeholder="사용하실 비밀번호를 입력해 주세요"
              value={formData.userPw}
              onChange={handleChange}
              name="userPw"
            />
            <div className={styles.errorMessagesWrap}>
              {errors.userPw && (
                <p className={styles.errorMessages}>{errors.userPw}</p>
              )}
            </div>

            <Input
              type="password"
              placeholder="비밀번호를 한 번 더 입력해 주세요"
              value={formData.confirmPw}
              onChange={handleChange}
              name="confirmPw"
            />
            <div className={styles.errorMessagesWrap}>
              {errors.confirmPw && (
                <p className={styles.errorMessages}>{errors.confirmPw}</p>
              )}
            </div>
          </div>
          <div className={styles.agreements}>
            <Checkbox
              checked={formData.agreeTerms}
              onChange={(checked) =>
                setFormData((prev) => ({ ...prev, agreeTerms: checked }))
              }
            >
              <p onClick={() => openModal("서비스 이용약관", termsOfService)}>
                서비스 이용약관
              </p>
            </Checkbox>
            <Checkbox
              checked={formData.agreePrivacy}
              onChange={(checked) =>
                setFormData((prev) => ({ ...prev, agreePrivacy: checked }))
              }
            >
              <p onClick={() => openModal("개인정보 처리방침", privacyPolicy)}>
                개인정보 처리방침
              </p>
            </Checkbox>
          </div>

          <Modal
            isOpen={modalState.isOpen}
            onClose={closeModal}
            title={modalState.title}
            content={modalState.content}
          />

          <div>
            <button
              type="submit"
              disabled={!isFormVaild}
              className={styles.btn_login}
              onClick={handleSignup}
            >
              <span className={styles.btn_text}>회원가입</span>
            </button>
          </div>
        </form>
      </AuthLayout>
    </>
  );
}

export default Signin;
