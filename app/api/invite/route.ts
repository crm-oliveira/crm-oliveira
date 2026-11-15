import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
export async function POST(req:NextRequest) {
 try {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, pub=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, secret=process.env.SUPABASE_SERVICE_ROLE_KEY
  if(!url||!pub||!secret) return NextResponse.json({error:'Configuração incompleta no servidor'},{status:500})
  const token=req.headers.get('authorization')?.replace(/^Bearer /,'')
  if(!token) return NextResponse.json({error:'Não autorizado'},{status:401})
  const client=createClient(url,pub), admin=createClient(url,secret,{auth:{autoRefreshToken:false,persistSession:false}})
  const {data:{user},error:authError}=await client.auth.getUser(token)
  if(authError||!user) return NextResponse.json({error:'Sessão inválida'},{status:401})
  const {data:profile,error:profileError}=await admin.from('perfis').select('papel,ativo').eq('id',user.id).single()
  if(profileError||profile?.papel!=='administrador'||!profile.ativo) return NextResponse.json({error:'Apenas administrador'},{status:403})
  const body=await req.json(), email=String(body.email||'').trim().toLowerCase(), nome=String(body.nome||'').trim()
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!nome||nome.length>120) return NextResponse.json({error:'Nome ou e-mail inválido'},{status:400})
  const site=process.env.NEXT_PUBLIC_SITE_URL
  if(!site) return NextResponse.json({error:'Configure NEXT_PUBLIC_SITE_URL'},{status:500})
  const {data,error}=await admin.auth.admin.inviteUserByEmail(email,{redirectTo:site, data:{nome}})
  if(error||!data.user) return NextResponse.json({error:error?.message||'Falha ao convidar'},{status:400})
  const {error:insertError}=await admin.from('perfis').upsert({id:data.user.id,nome,papel:'corretor',ativo:true},{onConflict:'id'})
  if(insertError) return NextResponse.json({error:'Convite enviado, mas perfil não criado. Verifique no Supabase antes de reenviar.'},{status:500})
  return NextResponse.json({ok:true})
 } catch {return NextResponse.json({error:'Falha ao processar solicitação'},{status:500})}
}
