interface SubjectDataProps {
    id?: String
    name: String
    description: String
    supervisor: {
        id: String,
        userName: String
    }
    goal: String
    credits: number
    language: "Czech" | "English",
    degree: "Bachelor" | "Master",
    students: Array<
        {
            id: String,
            userName: String
        }
    >
    topicIdList:Array<String>
    digitalContentIdList:Array<String>
}

export type { SubjectDataProps }