import OptionsModal from '../components/OptionsModal'
import { COLORS, FONT_FAMILY, FONTS, SIZES } from '../constants/theme'
import { IconCalendar, IconClock24 } from '@tabler/icons-react-native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { fetch } from '@react-native-community/netinfo'
import { toast } from "@backpackapp-io/react-native-toast";
import { getAllAirports, saveLegDetails } from '../services/master.service'

const JourneyEditForm = ({ data, onClose }) => {
  const queryClient = useQueryClient();
  const [editedLegDetails, setEditedLegDetails] = useState(data)
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [isDepartureTimePickerVisible, setDepartureTimePickerVisibility] = useState(false)
  const [optionsModalState, setOptionsModalState] = useState({ show: false })

  const airportsQuery = useQuery({
    queryKey: ['airports-list'],
    queryFn: () => getAllAirports()
  })

  const updateLegMutation = useMutation({
    mutationKey: 'update-legs',
    mutationFn: filterParams => saveLegDetails(filterParams)
  })

  const handleConfirmDate = date => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD')
    setEditedLegDetails(old => ({
      ...old,
      journey_date: formattedDate
    }))
    setDatePickerVisibility(false)
  }

  const handleConfirmDepartureTime = time => {
    setEditedLegDetails(old => ({
      ...old,
      departure_time: dayjs(time).format('HH:mm')
    }))
    setDepartureTimePickerVisibility(false)
  }

  const handleFlightChange = value => {
    setEditedLegDetails(old => ({
      ...old,
      flight_number: value
    }))
  }

  const handleAirportChange = (key, airportItem) => {
    setEditedLegDetails(old => ({
      ...old,
      [key]: airportItem?.id,
      [key === 'depart_airport_id' ? 'depart_airport_code' : 'arrival_airport_code']: airportItem?.airport_code,
      [key === 'depart_airport_id' ? 'depart_airport_name' : 'arrival_airport_name']: airportItem?.airport_name
    }))
    setOptionsModalState({ show: false })
  }

  const handleSave = async () => {
    await fetch().then(async (state) => {
      if (JSON.stringify(editedLegDetails) !== JSON.stringify(data)) {
        updateLegMutation.mutate({ isConnected: state.isConnected, data: {
          id: editedLegDetails?.id, 
          flight_number: editedLegDetails?.flight_number,
          departure_time: editedLegDetails?.departure_time,
          journey_date: editedLegDetails?.journey_date,
          depart_airport_id: editedLegDetails?.depart_airport_id,
          arrive_airport_id: editedLegDetails?.arrive_airport_id
        }}, {
          onSuccess: () => {
            toast("Leg Updated successfully", {type: 'success'});
            queryClient.invalidateQueries({ queryKey: ['journey-legs'] });
          },
          onError:(e) => {
            console.log('Error>>>>>>>>>>>>>>>>>>',e);
            toast(e, {type: 'error'});
          },
          onSettled: () => {
            onClose();
          }
        })
      } else {
        toast("No changes to save", {type: 'success'});
        onClose();
      }
    })
    .catch(e => {
      console.log('Error>>>>>>>>>>>>>>>>>>',e);
    })
  }

  const handleFromChange = () => {
    if (editedLegDetails.leg_number === 1) return
    setOptionsModalState({
      show: true,
      title: 'Origin',
      inputKey: 'depart_airport_id'
    })
  }

  const handleToChange = () => {
    setOptionsModalState({
      show: true,
      title: 'Destination',
      inputKey: 'arrive_airport_id'
    })
  }

  return (
    <>
      <Text style={styles.modalTitle}>Edit Journey Details</Text>
      <View style={styles.root}>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>Journey Date</Text>
            <TouchableOpacity
              style={styles.touchableInput}
              onPress={() => setDatePickerVisibility(true)}
            >
              <Text style={styles.value}>
                {dayjs(new Date(editedLegDetails.journey_date)).format(
                  'DD MMM YYYY'
                )}
              </Text>
              <IconCalendar
                size={24}
                color={COLORS.primary}
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>Departure Time</Text>
            <TouchableOpacity
              style={styles.touchableInput}
              onPress={() => setDepartureTimePickerVisibility(true)}
            >
              <Text style={styles.value}>
                {editedLegDetails.departure_time || 'Choose'}
              </Text>
              <IconClock24 size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode='date'
          minimumDate={dayjs(new Date()).subtract(30, 'day').toDate()}
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisibility(false)}
        />

        <DateTimePickerModal
          is24Hour
          isVisible={isDepartureTimePickerVisible}
          mode='time'
          display='spinner'
          value={
            new Date(
              `${editedLegDetails.journey_date} ${editedLegDetails.departure_time}`
            )
          }
          onConfirm={handleConfirmDepartureTime}
          onCancel={() => setDepartureTimePickerVisibility(false)}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Flight Number</Text>
          <TextInput
            style={styles.input}
            value={editedLegDetails.flight_number}
            onChangeText={handleFlightChange}
            autoCorrect={false}
            autoCapitalize='characters'
            placeholder='Flight Number'
            placeholderTextColor={COLORS.shade3}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: SIZES.padding
          }}
        >
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>Origin</Text>
            {/* use this if onPress event needed for Origin: setOptionsModalState({ show: true, title: "from", inputKey: "depart_airport_id" }) */}
            <TouchableOpacity
              style={[
                styles.input,
                { flexDirection: 'row', alignItems: 'center' }
              ]}
              onPress={handleFromChange}
            >
              <Text style={styles.value}>
                {editedLegDetails.depart_airport_code}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>Destination</Text>
            <TouchableOpacity
              style={[
                styles.input,
                { flexDirection: 'row', alignItems: 'center' }
              ]}
              onPress={handleToChange}
            >
              <Text style={styles.value}>
                {editedLegDetails.arrival_airport_code}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.actionButton, styles.saveButton]}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.actionButton, styles.cancelButton]}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
      <OptionsModal
        show={optionsModalState?.show}
        label={optionsModalState?.title}
        options={airportsQuery?.data?.filter(airport => {
          return (
            airport.id !== editedLegDetails[optionsModalState?.inputKey]
          )
        })}
        onSelect={selected => {
          handleAirportChange(optionsModalState?.inputKey, selected)
        }}
        onClose={() => setOptionsModalState({ show: false })}
      />
    </>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.white
  },
  modalTitle: {
    ...FONTS.h2,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.primary,
    width: '100%',
    textAlign: 'left',
    marginBottom: 20
  },
  inputContainer: {
    marginBottom: 20
  },
  touchableInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.shade4,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    height: 48
  },
  input: {
    height: 48,
    borderColor: COLORS.shade4,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    ...FONTS.body4,
    color: COLORS.black
  },
  label: {
    ...FONTS.body5,
    color: COLORS.black3,
    marginBottom: 5
  },
  value: {
    ...FONTS.body4,
    color: COLORS.black1,
    flex: 1
  },
  segmentedControl: {
    marginTop: 10
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: SIZES.radius,
    alignItems: 'center'
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    marginRight: 10
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.primary
  },
  saveButtonText: {
    ...FONTS.h5,
    color: COLORS.white
  },
  cancelButtonText: {
    ...FONTS.h5,
    color: COLORS.primary
  }
})

export default JourneyEditForm
