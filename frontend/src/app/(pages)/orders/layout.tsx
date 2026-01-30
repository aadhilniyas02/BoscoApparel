import UserLayout from '@/app/componenets/UserLayout';
import React from 'react'

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserLayout>{children}</UserLayout>
  )
}

export default layout