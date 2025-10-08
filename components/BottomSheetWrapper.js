// import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
// import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";

// const BottomSheetWrapper = forwardRef(({ children, index=0, snapPoint = [400] }, ref) => {
//   const bottomSheetModalRef = useRef(null);
//   const snapPoints = useMemo(() => snapPoint, [snapPoint]);

//   useImperativeHandle(ref, () => ({
//     open: () => {
//       bottomSheetModalRef.current?.present();
//     },
//     close: () => {
//       bottomSheetModalRef.current?.dismiss();
//     },
//   }));

//   return (
//     <BottomSheetModal
//       index={index}
//       snapPoints={snapPoints}
//       keyboardBehavior="extend"
//       ref={bottomSheetModalRef}
//       backdropComponent={(props) => (
//         <BottomSheetBackdrop
//           {...props}
//           disappearsOnIndex={-1}
//           appearsOnIndex={0}
//         />
//       )}
//     >
//       {children}
//     </BottomSheetModal>
//   );

// })

// export default BottomSheetWrapper

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomBackdrop from "./CustomBackdrop"; // path to your custom backdrop component

const BottomSheetWrapper = forwardRef(({ children, index = 0, snapPoint = [400] }, ref) => {
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => snapPoint, [snapPoint]);

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetModalRef.current?.present();
    },
    close: () => {
      bottomSheetModalRef.current?.dismiss();
    },
  }));

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={index}
      snapPoints={snapPoints}
      keyboardBehavior="extend"
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
      {children}
    </BottomSheetModal>
  );
});

export default BottomSheetWrapper;
