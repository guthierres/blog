"use client"
import { useCallback, useEffect, useState } from "react"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [color, setColor] = useState(value)

  useEffect(() => {
    setColor(value)
  }, [value])

  const handleChange = useCallback(
    (color: string) => {
      setColor(color)
      onChange(color)
    },
    [onChange],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }} />
          <span>{color}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <HexColorPicker color={color} onChange={handleChange} />
      </PopoverContent>
    </Popover>
  )
}

