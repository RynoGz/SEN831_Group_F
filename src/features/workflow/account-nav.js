"use client";
import Link from 'next/link';
import {useState} from 'react';
import {useApi} from './use-api';
export default function AccountNav(){
 const {data}=useApi('/api/session');const [error,setError]=useState('');
 // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- Full navigation discards session-dependent UI after sign-out.
 async function logout(){try{const r=await fetch('/api/session',{method:'DELETE'});if(!r.ok)throw Error();window.location.assign('/');}catch{setError('Sign out failed. Please try again.');}}
 if(!data)return <Link href="/auth/login">Sign in</Link>;
 return <><span className="small">{data.name}</span>{['staff','manager'].includes(data.role)&&<Link href="/work">Work queue</Link>}{data.role==='manager'&&<Link href="/management">Overview</Link>}<button type="button" className="nav-button" onClick={logout}>Sign out</button>{error&&<span role="alert">{error}</span>}</>;
}
