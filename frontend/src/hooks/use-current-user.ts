"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { USER_EMAIL_COOKIE_KEY, USER_NAME_COOKIE_KEY } from "@/constants/auth"

export interface CurrentUser {
  name: string
  email: string
}

/**
 * Cookie からログイン中のユーザー情報を取得するカスタムフック
 */
export const useCurrentUser = () => {
  const [user, setUser] = useState<CurrentUser>({
    name: "",
    email: "",
  })

  useEffect(() => {
    const email = Cookies.get(USER_EMAIL_COOKIE_KEY) || ""
    const name = Cookies.get(USER_NAME_COOKIE_KEY) || ""

    setUser({ name, email })
  }, [])

  return user
}