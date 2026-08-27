import axios from "axios";

const languageMap = {
    c: "c",
    cpp: "cpp17",
    java: "java",
    python: "python3",
    javascript: "nodejs"
};

export const executeCode = async ({
    language,
    code,
    stdin = ""
}) => {
    try {
        const jdoodleLanguage = languageMap[language];

        if (!jdoodleLanguage) {
            throw new Error(`Unsupported language: ${language}`);
        }

        const response = await axios.post(
            "https://api.jdoodle.com/v1/execute",
            {
                clientId: process.env.JDOODLE_CLIENT_ID,
                clientSecret: process.env.JDOODLE_CLIENT_SECRET,
                script: code,
                language: jdoodleLanguage,
                versionIndex: "0",
                stdin
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "JDoodle Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};