interface SubjectDataProps {
    _id?: string
    name: string
    description: string
    supervisor: {
        id: string,
        userName: string
    }
    goal: string
    credits: number
    language: "Czech" | "English",
    degree: "Bachelor" | "Master",
    students: Array<
        {
            id: string,
            userName: string
        }
    >
    topicIdList:Array<string>
    digitalContentIdList:Array<string>
}

export type { SubjectDataProps }