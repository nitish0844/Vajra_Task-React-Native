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
  // TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { SIZES, COLORS, FONTS, FONT_FAMILY } from '@/constants/theme'
import useActiveLegStore from '@/store/activeLegStore'
import { useQuery } from '@tanstack/react-query'
import { getCurrentJourneyOrdersSummaryFromDB, getCurrentLegOrdersSummaryFromDB } from '@/services/orders.service'
import { FlatList } from 'react-native-gesture-handler'
import useAuthStore from '@/store/authStore'
import OrderDetailsModal from './OrderDetailsModal'
import SummaryViewModal from './SummaryViewModal'

const transformOrderSummary = (data) => {
  return {
    foc: data?.filter(item => item?.is_foc),
    purchased: data?.filter(item => !item?.is_foc),
    closingBalance: data?.reduce((acc, item) => {
      const soldQuantity = item?.quantity || 0;

      if (!acc[item?.flight_number]) {
        acc[item?.flight_number] = {
          available_scc: item?.opening_scc,
          available_cc: item?.opening_cc
        };
      }

      acc[item?.flight_number].available_scc -= soldQuantity;
      acc[item?.flight_number].available_cc -= soldQuantity;

      return acc;
    }, {})
  };
};


const OrderSummary = forwardRef(
  ({ handleEndJourney, handleContinue, isEndJourney, isUsersLastLeg, isRefetch = false, setIsRefetch }, ref) => {
    const bottomSheetModalRef = useRef(null)
    const [orderDetailsList, setOrderDetailsList] = useState({ order: null, list: [], isFOC: false });
    const { leg: activeLeg, isSCC } = useActiveLegStore()?.data;
    const authState = useAuthStore();
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    
    useImperativeHandle(ref, () => ({
      open: () => {
        setIsSummaryModalOpen(true)
      },
      close: () => {
        setIsSummaryModalOpen(false)
      }
    }));

    const orderSummaryQuery = useQuery({
      enabled: Boolean(activeLeg?.journey_id),
      initialData: { foc: [], purchased: [], closingBalance: {} },
      queryKey: ['orderSummary-', activeLeg?.journey_id, authState.auth?.id, isSCC],
      queryFn: () => getCurrentJourneyOrdersSummaryFromDB({ userId: authState.auth?.id, journeyId: activeLeg?.journey_id, isSCC, activeLegNumber: activeLeg?.leg_number }),
      select: transformOrderSummary
    });

    useEffect(() => {
      if (isRefetch) {
        orderSummaryQuery.refetch();
        setIsRefetch(false);
      }
    }, [isRefetch]);

    useEffect(() => {
      return () => {
        if (bottomSheetModalRef.current) {
          bottomSheetModalRef.current = null;
        }
      };
    }, []);

    const handleSubmit = () => {
      if (isEndJourney) {
        handleEndJourney();
      } else {
        handleContinue();
      }
    }

    const handleRowPress = async ({ selectedOrder, foc }) => {
      try {
        const legOrders = await getCurrentLegOrdersSummaryFromDB({ journeyLegId: selectedOrder?.journey_leg_id });
        setOrderDetailsList({
          order: selectedOrder,
          list: legOrders?.filter(order => Boolean(order?.is_foc) === foc),
          isFOC: foc
        });
        setIsDetailsModalOpen(true);
      } catch (error) {
        console.log('---ERROR FROM DB for journeyLegId: getCurrentLegOrdersSummaryFromDB > ', error);
      }
    }

    return (
      <>
        {/* <BottomSheetModal
          index={0}
          snapPoints={snapPoints}
          ref={bottomSheetModalRef}
          backdropComponent={(props) => (
            <CustomBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
              opacity={0.5}
              closeOnPress={true}
            />
          )}
        >
          <BottomSheetView style={styles.root}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitleText}>
                Thank you very much for your efforts.
              </Text>
              <Text style={styles.modalDescText}>
                Here is your summary. ({activeLeg?.sector_pattern})
              </Text>
            </View>
            <View style={[styles.tableContainer]}>
              <View key={"head2"} style={styles.tableHeader}>
                <Text style={styles.th}>Flight</Text>
                <Text style={styles.th}>Route</Text>
                <Text style={[styles.th, styles.right]}>Sold Qty</Text>
                <Text style={[styles.th, styles.right]}>Price</Text>
                <Text style={[styles.th, styles.right]}>Closing Bal</Text>
              </View>
              {orderSummaryQuery?.data?.purchased?.map((order, index) => {
                return (
                  <TouchableOpacity
                    key={"row" + index}
                    style={styles.tableRow}
                    onPress={() =>
                      handleRowPress({
                        selectedOrder: order,
                        foc: false,
                      })
                    }
                  >
                    <Text style={styles.td}>{order?.flight_number}</Text>
                    <Text style={styles.td}>
                      {order?.departure_airport}-{order?.arrival_airport}
                    </Text>
                    <Text style={[styles.td, styles.right]}>
                      {order?.quantity}
                    </Text>
                    <Text style={[styles.td, styles.right]}>
                      ₹ {order?.price}
                    </Text>
                    <Text style={[styles.td, styles.right]}>
                      {isSCC
                        ? orderSummaryQuery?.data?.closingBalance?.[
                            order?.flight_number
                          ]?.available_scc
                        : orderSummaryQuery?.data?.closingBalance?.[
                            order?.flight_number
                          ]?.available_cc}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <View key={"total"} style={styles.tableFooter}>
                <Text style={styles.th}></Text>
                <Text style={styles.th}>Total</Text>
                <Text style={[styles.th, styles.right]}>
                  {totalRow?.totalPurchasedQuantity}
                </Text>
                <Text style={[styles.th, styles.right]}>
                  ₹ {totalRow?.totalPurchasedPrice}
                </Text>
                <Text style={[styles.th, styles.right]}>
                  {isSCC
                    ? orderSummaryQuery?.data?.closingBalance?.[
                        activeLeg?.flight_number
                      ]?.available_scc
                    : orderSummaryQuery?.data?.closingBalance?.[
                        activeLeg?.flight_number
                      ]?.available_cc}
                </Text>
              </View>
            </View>

            {orderSummaryQuery?.data?.foc?.length ? (
              <View
                style={[
                  styles.tableContainer,
                  { marginTop: SIZES.padding * 2 },
                ]}
              >
                <Text
                  style={[
                    styles.modalDescText,
                    {
                      ...FONTS.h5,
                      textAlign: "center",
                    },
                  ]}
                >
                  FOC
                </Text>
                <View key={"head2"} style={styles.tableHeader}>
                  <Text style={styles.th}>Flight</Text>
                  <Text style={styles.th}>Route</Text>
                  <Text style={[styles.th, styles.right]}>Sold Qty</Text>
                  <Text style={[styles.th, styles.right]}>Price</Text>
                  <Text style={[styles.th, styles.right]}>Closing Bal</Text>
                </View>
                {orderSummaryQuery?.data?.foc?.map((order, index) => {
                  return (
                    <TouchableOpacity
                      key={"row" + index}
                      style={styles.tableRow}
                      onPress={() =>
                        handleRowPress({
                          selectedOrder: order,
                          foc: true,
                        })
                      }
                    >
                      <Text style={styles.td}>{order?.flight_number}</Text>
                      <Text style={styles.td}>
                        {order?.departure_airport}-{order?.arrival_airport}
                      </Text>
                      <Text style={[styles.td, styles.right]}>
                        {order?.quantity}
                      </Text>
                      <Text style={[styles.td, styles.right]}>
                        ₹ {order?.price}
                      </Text>
                      <Text style={[styles.td, styles.right]}>
                        {isSCC
                          ? orderSummaryQuery?.data?.closingBalance?.[
                              order?.flight_number
                            ]?.available_scc
                          : orderSummaryQuery?.data?.closingBalance?.[
                              order?.flight_number
                            ]?.available_cc}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                <View key={"total"} style={styles.tableFooter}>
                  <Text style={styles.th}></Text>
                  <Text style={styles.th}>Total</Text>
                  <Text style={[styles.th, styles.right]}>
                    {totalRow?.totalFocQuantity}
                  </Text>
                  <Text style={[styles.th, styles.right]}>
                    ₹ {totalRow?.totalFocPrice}
                  </Text>
                  <Text style={[styles.th, styles.right]}>
                    {isSCC
                      ? orderSummaryQuery?.data?.closingBalance?.[
                          activeLeg?.flight_number
                        ]?.available_scc
                      : orderSummaryQuery?.data?.closingBalance?.[
                          activeLeg?.flight_number
                        ]?.available_cc}
                  </Text>
                </View>
              </View>
            ) : null}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.actionButton, styles.saveButton]}
              >
                <Text style={styles.saveButtonText}>
                  {isEndJourney || isUsersLastLeg ? "End Journey" : "Continue"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => bottomSheetModalRef.current?.dismiss()}
                style={[styles.actionButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal> */}

        {/* <BottomSheetModal
          index={0}
          snapPoints={detailsModalSnapPoints}
          ref={detailsModalRef}
          onDismiss={() => {
            setOrderDetailsList({ order: null, list: [], isFOC: false });
            bottomSheetModalRef.current?.present();
          }}
          backdropComponent={(props) => (
            <CustomBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              opacity={0.5}
              closeOnPress={true}
            />
          )}
        >
          <BottomSheetView style={[styles.root, { flex: 1 }]}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitleText}>
                {orderDetailsList?.isFOC ? "FOC" : "Sales"} Detail
              </Text>
              <Text style={styles.modalDescText}>
                Here is your {orderDetailsList?.isFOC ? "FOC" : "sales"} detail.
                ({orderDetailsList?.order?.departure_airport}-
                {orderDetailsList?.order?.arrival_airport})
              </Text>
            </View>
            <View
              style={[
                styles.tableContainer,
                { flex: 1, maxHeight: SIZES.height * 0.9, overflow: "hidden" },
              ]}
            >
              <FlatList
                keyboardShouldPersistTaps="handled"
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                data={orderDetailsList?.list || []}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={
                  <View style={styles.tableHeader}>
                    <Text style={[styles.th, { flex: 3 }]}>Product</Text>
                    <Text style={[styles.th, styles.right]}>Sold Quantity</Text>
                    <Text style={[styles.th, styles.right]}>Price</Text>
                  </View>
                }
                renderItem={({ item, index }) => {
                  return (
                    <View key={"row" + index} style={[styles.tableRow]}>
                      <Text style={[styles.td, { flex: 3 }]}>
                        {item?.product_name}
                      </Text>
                      <Text style={[styles.td, styles.right]}>
                        {item?.quantity}
                      </Text>
                      <Text style={[styles.td, styles.right]}>
                        ₹ {item?.price}
                      </Text>
                    </View>
                  );
                }}
              />
              <View style={[styles.buttonsContainer, { height: 140 }]}>
                <TouchableOpacity
                  onPress={() => detailsModalRef.current?.dismiss()}
                  style={[
                    styles.actionButton,
                    styles.cancelButton,
                    { maxHeight: 50 },
                  ]}
                >
                  <Text style={styles.cancelButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal> */}

        <OrderDetailsModal
          show={isDetailsModalOpen}
          data={orderDetailsList}
          onClose={() => {
            setIsDetailsModalOpen(false);
            bottomSheetModalRef.current?.present();
          }}
        />

        <SummaryViewModal
          show={isSummaryModalOpen}
          onClose={() => setIsSummaryModalOpen(false)}
          orderSummaryQuery={orderSummaryQuery}
          handleSubmit={handleSubmit}
          isEndJourney={isEndJourney}
          isUsersLastLeg={isUsersLastLeg}
          handleRowPress={handleRowPress}
        />
      </>
    );
  }
)

const styles = StyleSheet.create({
  root: {
    // flex: 1,
    backgroundColor: COLORS.white
  },
  modalRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary
  },
  modalTitleContainer: { padding: SIZES.padding, alignItems: 'center' },
  modalTitleText: { ...FONTS.h4 },
  modalDescText: { ...FONTS.body5, textAlign: 'left' },
  tableContainer: {
    flexDirection: 'column',   
  },
  tableHeader: {
    height: 56,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.primary2
  },
  th: {
    flex: 1,
    ...FONTS.h6,
    fontSize: SIZES.h6 - 1,
    textAlign: 'left',
    color: COLORS.white,
    padding: SIZES.padding / 1.5,
    fontFamily: FONT_FAMILY.semiBold
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.shade4,
    height: 38
  },
  td: {
    flex: 1,
    ...FONTS.body6,
    color: COLORS.black2,
    textAlign: 'left',
    padding: SIZES.padding / 1.5
  },
  right: {
    textAlign: 'right'
  },
  tableFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    height: 38,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.primary2
  },
  buttonsContainer: {
    flexDirection: "column",
    // justifyContent: "space-between",
    gap: SIZES.padding * 2,
    marginTop: SIZES.padding * 2,
    marginHorizontal: SIZES.padding * 2
  },
  actionButton: {
    flex: 1,
    padding: 15,
    minHeight: 50,
    borderRadius: SIZES.radius,
    alignItems: 'center'
  },
  saveButton: {
    backgroundColor: COLORS.primary
    // marginRight: SIZES.padding,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: SIZES.padding * 1.5
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

export default OrderSummary
