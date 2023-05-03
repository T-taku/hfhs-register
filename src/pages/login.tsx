import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { NextPage } from 'next';
import { Comp_Navbar } from '../components/Navbar';
import Head from "next/head";

export default function Login() {
    const { data: session } = useSession()
    const [inputValue, setInputValue] = useState("");

    return (
        <>
            const numberButtons = Array.from({ length: 10 }, (_, index) => (
            <button key={index} onClick={() => setInputValue(prev => prev + index)}>
                {index}
            </button>
            ));
        </>
    )
  }