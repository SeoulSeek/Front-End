import React, { use, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/Input/Input";
import styles from "./SigninPage.module.css";
import Checkbox from "../../components/Checkbox/Checkbox";

function Signin() {
  const [formData, setFormData] = useState({
    userName: "", // 유저이름
    userEmail: "", // 이메일
    userPw: "", // 비밀번호
    confirmPw: "", // 재확인
    agreeTerms: false, // 서비스 이용약관
    agreePrivacy: false, // 개인정보처리방침
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

  const handleEmailVerification = () => {
    alert("이메일 인증 요청이 전송되었습니다.");
    // 이메일 인증 로직 추가
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

  const handleSignin = (e) => {
    e.preventDefault();

    if (!isFormVaild) {
      // 버튼 비활성화
      alert("양식에 맞지 않습니다.");
      return;
    }

    console.log("회원가입 데이터:", formData);
    // 회원가입 처리 로직 (로컬진행=>추후 백연결)
  };

  return (
    <>
      <AuthLayout title="회원가입">
        <form onSubmit={handleSignin} className={styles.form}>
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
              link="/terms" // 실제 약관 페이지 경로로 변경
            >
              서비스 이용약관
            </Checkbox>
            <Checkbox
              checked={formData.agreePrivacy}
              onChange={(checked) =>
                setFormData((prev) => ({ ...prev, agreePrivacy: checked }))
              }
              link="/terms" // 실제 약관 페이지 경로로 변경
            >
              개인정보처리방침
            </Checkbox>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isFormVaild}
              className={styles.btn_login}
              onClick={handleSignin}
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
