"use client";
import {useEffect,useState} from 'react';
export function useApi(url){
 const [state,setState]=useState({loading:true,data:null,error:null});
 useEffect(()=>{const controller=new AbortController();
  fetch(url,{signal:controller.signal,cache:'no-store'}).then(async response=>{
   const data=await response.json();if(!response.ok)throw new Error(data.error||'The information could not be loaded.');
   setState({loading:false,data,error:null});
  }).catch(error=>{if(error.name!=='AbortError')setState({loading:false,data:null,error:error.message});});
  return()=>controller.abort();
 },[url]);
 return state;
}
export function ApiState({state}){
 if(state.loading)return <p role="status">Loading…</p>;
 if(state.error)return <p className="feedback error-feedback" role="alert">{state.error}</p>;
 return null;
}
export const displayTime=value=>value?new Date(value).toLocaleString('en-ZA',{timeZone:'Africa/Johannesburg'})+' SAST':'Not set';
