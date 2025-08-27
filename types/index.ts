export interface Card {
    column: string;
    title: string;
    id: string;
    user: {
        hidden: boolean; name: string; color: string 
};
    likes: any[];
}

export interface CardUser { name: string, color: string }

export interface User { name: string; color: string, hidden: boolean; superUser?: boolean };