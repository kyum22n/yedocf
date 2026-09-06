import { kakaoLogo, googleLogo } from "@/assets/images";

const SocialButton = ({ platform, onClick }) => {
    const platforms = {
        kakao: {
            logo: kakaoLogo,
            name: "카카오로 로그인하기",
            bgColor: "bg-[#FEE500]",
            textColor: "text-[#3C1E1E]",
        },
        google: {
            logo: googleLogo,
            name: "Google로 로그인하기",
            bgColor: "bg-white",
            textColor: "text-[#3C4043]",
            border: "border border-[#DADCE0]",
        },
    };

    const { logo, name, bgColor, textColor, border } = platforms[platform] || {};

    return (
        <button
            onClick={onClick}
            className={`w-full h-11 rounded-md font-semibold flex-center shadow ${bgColor} ${textColor} ${border ?? ""}`}
        >
            <img src={logo} alt={`${platform} logo`} className="w-6 h-6 mr-3" />
            <p>{name}</p>
        </button>
    );
};

export default SocialButton;
