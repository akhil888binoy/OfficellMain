export interface Vent {
    category: string;
    company_id: string;
    id: string;
    verified_employee: boolean;
    content: string;
    upvote: string;
    downvote: string;
    company:{
      name : string ,
      country: string
    };
    _count :{
      comments:string
    };
    author:{
      username:string
    };
    createdAt: string;
    author_id:string;
    Media:[];
    votes:[];
    comments:[{
      id:string,
      comment:string
    }];

}