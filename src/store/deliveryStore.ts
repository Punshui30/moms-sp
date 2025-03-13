import { create } from 'zustand';

interface DeliveryDriver {
  id: string;
  name: string;
  status: 'available' | 'delivering' | 'offline';
  currentLocation?: {
    lat: number;
    lng: number;
  };
  currentOrder?: string;
}

interface DeliveryStore {
  drivers: DeliveryDriver[];
  activeDeliveries: {
    orderId: string;
    driverId: string;
    status: 'assigned' | 'picked_up' | 'delivering' | 'completed';
    paymentAddress?: string;
    dropLocation: {
      lat: number;
      lng: number;
    };
  }[];
  addDriver: (driver: Omit<DeliveryDriver, 'id'>) => void;
  updateDriverStatus: (driverId: string, status: DeliveryDriver['status']) => void;
  updateDriverLocation: (driverId: string, location: { lat: number; lng: number }) => void;
  assignDelivery: (driverId: string, orderId: string, dropLocation: { lat: number; lng: number }) => void;
  updateDeliveryStatus: (orderId: string, status: 'assigned' | 'picked_up' | 'delivering' | 'completed', playSound?: boolean) => void;
  setPaymentAddress: (orderId: string, address: string) => void;
}

export const useDeliveryStore = create<DeliveryStore>((set) => ({
  drivers: [],
  activeDeliveries: [],
  addDriver: (driver) =>
    set((state) => ({
      drivers: [...state.drivers, { ...driver, id: crypto.randomUUID() }],
    })),
  updateDriverStatus: (driverId, status) =>
    set((state) => ({
      drivers: state.drivers.map((driver) =>
        driver.id === driverId ? { ...driver, status } : driver
      ),
    })),
  updateDriverLocation: (driverId, location) =>
    set((state) => ({
      drivers: state.drivers.map((driver) =>
        driver.id === driverId ? { ...driver, currentLocation: location } : driver
      ),
    })),
  assignDelivery: (driverId, orderId, dropLocation) =>
    set((state) => ({
      activeDeliveries: [
        ...state.activeDeliveries,
        { orderId, driverId, status: 'assigned', dropLocation },
      ],
      drivers: state.drivers.map((driver) =>
        driver.id === driverId
          ? { ...driver, status: 'delivering', currentOrder: orderId }
          : driver
      ),
    })),
  updateDeliveryStatus: (orderId, status, playSound = true) =>
    set((state) => {
      if (status === 'completed' && playSound) {
        const audio = new Audio('https://jmp.sh/vRdFSwhU');
        audio.play().catch(console.error);
      }
      return {
        activeDeliveries: state.activeDeliveries.map((delivery) =>
          delivery.orderId === orderId ? { ...delivery, status } : delivery
        ),
      };
    }),
  setPaymentAddress: (orderId, address) =>
    set((state) => ({
      activeDeliveries: state.activeDeliveries.map((delivery) =>
        delivery.orderId === orderId ? { ...delivery, paymentAddress: address } : delivery
      ),
    })),
}));