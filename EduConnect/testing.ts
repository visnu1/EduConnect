db.getCollection('reviews').insertMany([
   {
      courseID: "da11d650-8e5f-11ee-b9d1-0242ac120002",
      studentID: "8e3c48a0-8e5f-11ee-b9d1-0242ac120002",
      professorID: "a135254e-8e5f-11ee-b9d1-0242ac120002",
      professorName: 'Joann Ordille',
      courseName: 'Advance Database',
      ratings: [
         {
            questionId: ObjectId("6566a1c4817c4a98f2be0fd8"),
            value: 5,
         },
         {
            questionId: ObjectId("6566a1c4817c4a98f2be0fd9"),
            value: 5
         },
         {
            questionId: ObjectId("6566a1c4817c4a98f2be0fda"),
            value: 5
         },
         {
            questionId: ObjectId("6566a1c4817c4a98f2be0fdb"),
            value: 5
         },
         {
            questionId: ObjectId("6566a1c4817c4a98f2be0fdc"),
            value: 5
         },
      ],
      review: "Professor Ordille is an exceptional educator, especially in the field of advanced database studies. Their in-depth knowledge and engaging teaching style make complex topics understandable and interesting. The course is challenging but immensely rewarding, providing practical skills and deep insights into database management. Highly recommended for anyone serious about mastering advanced database concepts.",
      createdAt: ISODate('2023-11-29T01:38:28.824Z'),
      updatedAt: ISODate('2023-11-29T01:38:28.824Z'),
   },
])