import React, {
  useMemo,
  forwardRef,
  useRef,
  useImperativeHandle,
  useCallback,
  useState,
  useEffect
} from 'react'
import {
  View,
  Text,
  // TouchableOpacity,
  StyleSheet,
  ScrollView,
  // TextInput,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native'
import {
  TouchableOpacity,
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput
} from '@gorhom/bottom-sheet'
import { SIZES, COLORS, FONTS, FONT_FAMILY } from '@/constants/theme'
import useActiveLegStore from '@/store/activeLegStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllAirports } from '@/services/master.service'
import { getUsersBasedOnRoleFromDB } from '@/services/master.service'
import OptionsModal from './OptionsModal'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import dayjs from 'dayjs'
import { useNetInfo } from "@react-native-community/netinfo";
import { updateLegData } from '@/services/common.service'
import { updateLegDetailsInDB } from '@/services/journey.service'
import { toast } from '@backpackapp-io/react-native-toast'
import { TextInput } from 'react-native-gesture-handler'

const UpdateLegDetails = ({ setIsDiversionHandlingDone, setRefetch, onClose }) => {
  const { isConnected } = useNetInfo();
  const activeLegState = useActiveLegStore();

  const { leg: activeLeg, isSCC } = activeLegState?.data;
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [optionsModalState, setOptionsModalState] = useState({ show: false })

  const [selectedRole, setSelectedRole] = useState({
    emp_name: "",
    emp_id: ""
  });

  const [flightNumber, setFlightNumber] = useState(activeLeg?.flight_number || '');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [airport, setAirport] = useState({
    code: activeLeg?.arrival_airport_code || '',
    id: activeLeg?.arrive_airport_id || null
  });
  const [departureDate, setDepartureDate] = useState(activeLeg?.departure_time || '');

  const usersQuery = useQuery({
    queryKey: ['cc'],
    queryFn: ({ queryKey }) => getUsersBasedOnRoleFromDB({ category: queryKey[1] })
  });

  const airportsQuery = useQuery({
    queryKey: ['airports-list'],
    queryFn: () => getAllAirports()
  })

  const updateLegDetailsMutation = useMutation({
    mutationKey: 'update-legs',
    mutationFn: ({ id, body }) => updateLegData({ id, body }),
  });

  const handleUserSelect = (d) => {
    setSelectedRole({
      emp_id: d?.id,
      emp_name: d?.emp_name
    })
    setShowEmployeeModal(false);
  }

  useEffect(() => {
    if (usersQuery.data && activeLeg?.cabin_crew_id) {
      const selectedEmployee = usersQuery.data.find(user => user.id === activeLeg.cabin_crew_id);
      if (selectedEmployee) {
        setSelectedRole({
          emp_id: selectedEmployee.id,
          emp_name: selectedEmployee.emp_name || ''
        });
      }
    }
  }, [usersQuery.data, activeLeg?.cabin_crew_id]);

  const handleConfirmDate = date => {
    setDepartureDate(dayjs(date).format('HH:mm'))
    setDatePickerVisibility(false)
  }

  const handleAirportChange = (key, airportItem) => {
    setAirport({ id: airportItem.id, code: airportItem.airport_code })
    setOptionsModalState({ show: false })
  }

  const handleFlightNumberChange = (text) => {
    setFlightNumber(text);
  };

  const handleSubmit = () => {
    if (!isConnected) {
      toast.error("Connect to internet to end your journey");
      return null;
    }

    const requestBody = {
      flight_number: flightNumber || null,
      departure_time: departureDate || null,
      arrive_airport_id: airport?.id || null,
      cabin_crew_id: selectedRole?.emp_id || null
    };

    // Remove keys with null or undefined values
    const changedFields = Object.fromEntries(
      Object.entries(requestBody).filter(
        ([key, value]) => value !== activeLeg?.[key] && value !== null && value !== undefined
      )
    );

    if (Object.keys(changedFields).length === 0) {
      console.log("No/ changes detected, skipping update.");
      return;
    }

    if (changedFields.hasOwnProperty("arrive_airport_id")) {
      changedFields.diversion = 1;
    }
  

    updateLegDetailsMutation.mutate(
      {
        id: activeLeg?.id,
        body: changedFields,
      },
      {
        onSuccess: async (data) => {
          toast.success('Leg Details updated successfully');
        
          let body = { ...changedFields };
        
          let filteredBody = Object.fromEntries(
            Object.entries(body).filter(([key]) => key !== "diversion")
          );
                
          if (changedFields.hasOwnProperty("arrive_airport_id")) {
            let sectorPattern = activeLeg.sector_pattern?.split('-');
        
            let updateIndex = activeLeg?.leg_number;
            if (updateIndex > 0 && updateIndex < sectorPattern.length) {
              sectorPattern[updateIndex] = airport.code;
              filteredBody.sector_pattern = sectorPattern?.join('-'); // Update filteredBody instead of body
            } else {
              console.warn("Invalid leg number for sector update.");
            }
          }
        
          // Send filteredBody (without "diversion") to updateLegDetailsInDB
          const updatedData = await updateLegDetailsInDB({ id: activeLeg?.id, updatedFields: filteredBody });
        
          if (updatedData) {
            await activeLegState.saveData({ leg: updatedData, isSCC: isSCC });
        
            setRefetch(true);
            onClose();
        
            if (changedFields.hasOwnProperty("arrive_airport_id")) {
              setIsDiversionHandlingDone(true);
            }
          } else {
            console.warn("Update failed or no new data was returned.");
          }
        }        
      }
    );
  };

  return (
    <>

      <View style={styles.modalTitleContainer}>
        <Text style={styles.modalTitleText}>
          Update Leg Details
        </Text>
      </View>

      <View style={styles.root}>

        <View style={{ paddingHorizontal: SIZES.padding }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: SIZES.padding * 5, marginTop: SIZES.padding }}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Journey Date</Text>
              <TouchableOpacity
                style={[styles.touchableInput, { backgroundColor: COLORS.lightGray2 }]}
                disabled
                onPress={() => setDatePickerVisibility(true)}
              >
                <Text style={[styles.value, { color: COLORS.darkGray}]}> {dayjs(new Date(activeLeg?.journey_date)).format(
                  'DD MMM YYYY'
                )}</Text>

              </TouchableOpacity>
            </View>


            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Departure Time</Text>
              <TouchableOpacity
                style={styles.touchableInput}
                onPress={() => setDatePickerVisibility(true)}
              >
                <Text style={styles.value}>{departureDate}</Text>

              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: SIZES.padding * 5 }}>
            <View style={[styles.inputContainer, { flex: 1}]}>
              <Text style={styles.label}>Flight Number</Text>
              <TextInput
                style={styles.input}
                autoCorrect={false}
                autoCapitalize='characters'
                placeholder="Flight number"
                placeholderTextColor={COLORS.gray}
                value={flightNumber}
                onChangeText={handleFlightNumberChange}
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Origin</Text>
              <TouchableOpacity
                style={[styles.touchableInput, { backgroundColor: COLORS.lightGray2 }]}
                disabled
                onPress={() => setDatePickerVisibility(true)}
              >
                <Text style={[styles.value, { color: COLORS.darkGray }]}>{activeLeg?.depart_airport_code}</Text>

              </TouchableOpacity>
            </View>

          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: SIZES.padding * 5 }}>

            <View style={[styles.inputContainer, { flex: 0.4 }]}>
              <Text style={styles.label}>Destination</Text>
              <TouchableOpacity
                style={styles.touchableInput}
                onPress={() => setOptionsModalState({ show: true })}
              >
                <Text style={styles.value}>{airport?.code}</Text>

              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.inputContainer]}>
              <Text style={styles.label}>Choose CC</Text>
              <TouchableOpacity
                style={styles.touchableInput}
                onPress={() => setShowEmployeeModal(true)}
              >
                <Text style={styles.value}>{selectedRole.emp_name || 'Select a CC'}</Text>

              </TouchableOpacity>
            </View>
        </View>


        <View style={styles.buttonsContainer}>

          <TouchableOpacity
            disabled={updateLegDetailsMutation.isPending}
            style={[styles.actionButton, styles.SaveButton]}
            onPress={handleSubmit}
          >
            {/* <Text style={styles.saveButtonText}>Save</Text> */}
            {updateLegDetailsMutation.isPending ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.actionButton, styles.cancelButton]}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

        </View>

        <OptionsModal
          show={showEmployeeModal}
          label={`CC member`}
          options={usersQuery.data || []}
          onSelect={handleUserSelect}
          onClose={() => setShowEmployeeModal(false)}
        />

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="time"
          minimumDate={dayjs(new Date()).subtract(30, 'day').toDate()}
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisibility(false)}
        />

        <OptionsModal
          show={optionsModalState?.show}
          label={optionsModalState?.title}
          options={airportsQuery?.data?.filter(airport => airport.airport_code !== activeLeg?.depart_airport_code) || []} // Filter origin airport
          onSelect={selected => {
            handleAirportChange(optionsModalState?.inputKey, selected)
          }}
          onClose={() => setOptionsModalState({ show: false })}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  root: {
    // flex: 1,
    backgroundColor: COLORS.white
  },
  modalTitleContainer: { padding: SIZES.padding },
  modalTitleText: {
    ...FONTS.h2,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.primary,
    width: '100%',
    textAlign: 'left',
    marginBottom: 20
  },
  root: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.white
  },
  textTitle: { ...FONTS.h5 },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: SIZES.padding * 2
  },
  actionButton: {
    flex: 1,
    minHeight: 50,
    width: SIZES.width * 0.35,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: SIZES.padding * 1.5
  },
  cancelButtonText: {
    ...FONTS.h5,
    color: COLORS.primary
  },
  ovalBorder: {
    borderWidth: 0.5,
    width: SIZES.width * 0.3,
    borderColor: 'black',
    borderRadius: 50, // Make it oval
    paddingHorizontal: 20, // Adjust for oval shape
    paddingVertical: 10,
    marginTop: SIZES.padding * 0.5
  },
  numberText: {
    ...FONTS.h5
  },
  disabled: {
    opacity: 0.5,
  },
  SaveButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: SIZES.padding * 1.5,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    alignSelf: "center"
  },
  saveButtonText: {
    ...FONTS.h5,
    color: COLORS.white
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  value: {
    ...FONTS.body5,
    color: COLORS.black1,
    flex: 1
  },
  // Modal View
  modalView: {
    width: '80%', // Width of the modal
    backgroundColor: COLORS.white, // Background color of the modal
    borderRadius: SIZES.radius, // Rounded corners
    padding: SIZES.padding * 2, // Padding inside the modal
    alignItems: 'center', // Center content horizontally
    shadowColor: '#000', // Shadow for elevation
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Elevation for Android
  },

  // Modal Text
  modalText: {
    ...FONTS.h4, // Use your theme's font style
    textAlign: 'center', // Center-align text
    color: COLORS.black, // Text color
    marginBottom: SIZES.padding * 2, // Spacing below the text
  },

  // No Changes Button
  NoChangeRequired: {
    backgroundColor: COLORS.lightGray, // Light gray background
    borderColor: COLORS.gray, // Gray border
    borderWidth: 1,
    marginRight: SIZES.padding, // Spacing between buttons
  },

  // No Changes Button Text
  NoChanges: {
    ...FONTS.h5, // Use your theme's font style
    color: COLORS.black, // Text color
  },

  // Changes Required Button
  ChangedRequiredContainer: {
    backgroundColor: COLORS.primary, // Primary color background
  },

  // Changes Required Button Text
  changesRequired: {
    ...FONTS.h5, // Use your theme's font style
    color: COLORS.white, // White text color
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
  ContentContainer: {
    marginTop: SIZES.padding * 0.5
  },
  label: {
    ...FONTS.body6,
    color: COLORS.black3,
    marginBottom: 5
  },
  inputContainer: {
    marginBottom: 20
  },
})

export default UpdateLegDetails
