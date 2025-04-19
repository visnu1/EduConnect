export interface Student {
    id: string;
    name: string;
    email: string;
    dob: string;
    phoneNumber: string;
    majorId: string;
    creditsCompleted: number;
    status: "active" | "inactive";
}
