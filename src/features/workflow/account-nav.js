"use client";
import Link from 'next/link';
import {useState} from 'react';

export default function AccountNav({session:data,workspace=false}){
 const [error,setError]=useState('');
 // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- Full navigation discards session-dependent UI after sign-out.
 async function logout(){try{const r=await fetch('/api/session',{method:'DELETE'});if(!r.ok)throw Error();window.location.assign('/');}catch{setError('Sign out failed. Please try again.');}}
 if(!data)return <Link className="button secondary" href="/auth/login">Sign in</Link>;
 return <><span className="account-profile"><span className="avatar" aria-hidden="true">{data.name?.split(' ').map(part=>part[0]).slice(0,2).join('').toUpperCase()||'C'}</span><span><strong>{data.name}</strong><span className="small account-role">{data.role}</span></span></span>{!workspace&&['staff','manager'].includes(data.role)&&<Link href="/work">Work queue</Link>}{!workspace&&data.role==='manager'&&<Link href="/management">Overview</Link>}<button type="button" className="nav-button" onClick={logout}>Sign out</button>{error&&<span role="alert">{error}</span>}</>;
}
