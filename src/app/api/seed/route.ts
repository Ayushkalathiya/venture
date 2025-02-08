import db from "@/lib/db";
import { Category, MemberType } from "@prisma/client";
import { NextResponse } from "next/server";

// api for seed data in the database

const userData = [
    {
      name: 'Jane Smith',
      email: 'janesmith@gmail.com',
      category: 'BLOCKCHAIN' as Category,
      type: 'MENTOR' as MemberType
    },{
      name: 'Ayush Kumar',
      email: 'ayush@gmail.com',
      category: 'ECOMMERCE' as Category,
      type: 'MENTOR' as MemberType
    },{
      name: 'Rahul Kumar',
      email: 'rahul@gmail.com',
      category: 'AI' as Category,
      type: 'INVESTOR' as MemberType
    },{
      name: 'Rajesh Kumar',
      email: 'rajesh@gmail.com',
      category: 'FINTECH' as Category,
      type: 'MENTOR' as MemberType  
    },{
      name: 'Rohit Kumar',
      email: 'rohit@gmail.com',
      category: 'HEALTH' as Category,
      type: 'INVESTOR' as MemberType
    },{
      name: 'Raj Kumar',
      email: 'raj@gmail.com',
      category: 'IOT' as Category,
      type: 'INVESTOR' as MemberType
    },{
      name: 'Meet Kumar',
      email: 'meet@gmail.com',
      category: 'EV' as Category,
      type: 'INVESTOR' as MemberType
    }
  ];

export async function GET() {
  // Get the seed data
  
    // Insert the seed data
    const respose = await db.investorMentor.createMany({
        data: userData,
    });

    console.log(respose);
    

    return NextResponse.json(respose);



  
  // Return the data

}