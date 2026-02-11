'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { getDictionary } from '@/lib/dictionaries'

export default function LanguageSwitcher({ locale, dictionary }: { locale: 'en' | 'ka', dictionary: Awaited<ReturnType<typeof getDictionary>>['languageSwitcher'] }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.replace(newPath)
  }

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder={dictionary.select} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{dictionary.en}</SelectItem>
        <SelectItem value="ka">{dictionary.ka}</SelectItem>
      </SelectContent>
    </Select>
  )
}
