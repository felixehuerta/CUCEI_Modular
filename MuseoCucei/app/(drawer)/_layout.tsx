import CustomDrawer from '@/components/CustomDrawer';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: '#4C9A2A' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          drawerActiveTintColor: '#4C9A2A',
          drawerActiveBackgroundColor: '#EAF4E2',
          drawerInactiveTintColor: '#6E7A80',
          drawerLabelStyle: { marginLeft: -6, fontSize: 15 },        }}
      >
        <Drawer.Screen
          name="home"
          options={{
            title: 'Museo CUCEI',
            drawerLabel: 'Pantalla principal',
            drawerIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="visualizar-arte"
          options={{
            title: 'Visualizar arte',
            drawerLabel: 'Visualizar arte',
            drawerIcon: ({ color, size }) => <Ionicons name="color-palette-outline" color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="arboles-recientes"
          options={{
            title: 'Árboles recientes',
            drawerLabel: 'Ver árboles recientes',
            drawerIcon: ({ color, size }) => <Ionicons name="leaf-outline" color={color} size={size} />,
          }}
        />
        <Drawer.Screen
  name="visor"
  options={{ title: 'Obra del árbol', drawerItemStyle: { display: 'none' } }}
/>
      </Drawer>
    </GestureHandlerRootView>
  );
}