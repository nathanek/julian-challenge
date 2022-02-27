import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import aus from 'date-fns/locale/en-AU';

export default function TableDatePicker() {
    const [date, setDate] = useState(new Date());
    registerLocale('en-AU', aus)

    return (
      <DatePicker locale="en-AU" selected={date} onChange={date => setDate(date)} />
    );
   }