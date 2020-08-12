import React, { useState, useMemo } from 'react';
import { DatePickerIOS, DatePickerAndroid, Platform } from 'react-native';
import { format, isBefore, startOfDay } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Toast from '~/components/Toast';

import { Container, DateButton, DateText, Picker } from './styles';

export default function DateInput({ date, onChange }) {
  const [opened, setOpened] = useState(false);

  const dateFormatted = useMemo(
    () => format(date, "dd 'de' MMMM 'de' yyyy", { locale: pt }),
    [date]
  );

  async function handleOpenPicker() {
    const { action, year, month, day } = await DatePickerAndroid.open({
      mode: 'spinner',
      date,
    });

    if (action === DatePickerAndroid.dateSetAction) {
      const selectedDate = new Date(year, month, day);
      if (!isBefore(selectedDate, startOfDay(new Date())))
        onChange(selectedDate);
      else {
        Toast.error('Datas passadas não são permitidas');
        handleOpenPicker();
      }
    }
  }

  return (
    <Container>
      {Platform.OS === 'android' ? (
        <DateButton onPress={handleOpenPicker}>
          <Icon name="event" color="#fff" size={20} />
          <DateText>{dateFormatted}</DateText>
        </DateButton>
      ) : (
        <>
          <DateButton onPress={() => setOpened(!opened)}>
            <Icon name="event" color="#fff" size={20} />
            <DateText>{dateFormatted}</DateText>
          </DateButton>

          {opened && (
            <Picker>
              <DatePickerIOS
                date={date}
                onDateChange={onChange}
                minimumDate={new Date()}
                minuteInterval={60}
                locale="pt"
                mode="date"
              />
            </Picker>
          )}
        </>
      )}
    </Container>
  );
}
