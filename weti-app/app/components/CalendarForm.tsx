"use client"

import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "~/lib/utils"
import { format } from "date-fns/format"
import { useForm } from "react-hook-form"

function CalendarForm() {
  const form = useForm()

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiration</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const oneYearFromNow = new Date();
                      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
                      return date <= today || date > oneYearFromNow;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default CalendarForm;