import React, { useEffect, useState } from 'react';
import { parseISO, formatRelative } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from '@react-navigation/native';
import api from '~/services/api';

import Background from '~/components/Background';
import Appointment from '~/components/Appointment';
import * as Toast from '~/components/Toast';

import { Container, Title, List } from './styles';

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    async function loadAppointments() {
      const response = await api.get('appointments');

      const data = response.data.map((appointment) => ({
        ...appointment,
        dateParsed: formatRelative(parseISO(appointment.date), new Date(), {
          locale: pt,
          addSuffix: true,
        }),
      }));

      setAppointments(data);
    }

    loadAppointments();
  }, [isFocused]);

  async function handleCancel(id) {
    try {
      Toast.loading(true);
      const response = await api.delete(`appointments/${id}`);

      setAppointments(
        appointments.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                canceled_at: response.data.canceled_at,
              }
            : appointment
        )
      );

      Toast.loading(false);
      Toast.success('Agendamento cancelado com sucesso!');
    } catch (error) {
      Toast.loading(false);
      Toast.error(error.response.data.error);
    }
  }

  return (
    <Background>
      <Container>
        <Title>Agendamentos</Title>

        <List
          data={appointments}
          keyExtractor={(item) => String(item)}
          renderItem={({ item }) => (
            <Appointment onCancel={() => handleCancel(item.id)} data={item} />
          )}
        />
      </Container>
    </Background>
  );
}

Dashboard.navigationOptions = {
  tabBarLabel: 'Agendamentos',
  tabBarIcon: ({ size, color }) => (
    <Icon name="event" size={size} color={color} />
  ),
};
