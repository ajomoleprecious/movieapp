import { Drawer } from 'expo-router/drawer';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GlobeAltIcon, HeartIcon, HomeIcon, MapPinIcon } from 'react-native-heroicons/solid';

export default function HomeLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={{
                    drawerStyle: {
                        backgroundColor: "#1f2937",
                        width: 300,
                    },
                    drawerHideStatusBarOnOpen: true,
                    drawerActiveBackgroundColor: "#eab308",
                    drawerActiveTintColor: "#fff",
                    drawerInactiveBackgroundColor: "gray",
                    drawerContentContainerStyle: {
                        gap: 20
                    },

                }}
            >
                <Drawer.Screen
                    name="index"
                    options={{
                        headerShown: false,
                        drawerLabel: ({ focused }) => (
                            <Text style={{ color: focused ? "#000" : "#fff", fontSize: 30, fontWeight: "bold" }}>
                                Home
                            </Text>
                        ),
                        headerTitle: "Home",
                        drawerIcon: ({ focused }) => <HomeIcon size={30} color={focused ? "#000" : "#fff"} />,
                    }}
                />
                <Drawer.Screen
                    name="favoritemovies"
                    options={{
                        headerShown: false,
                        drawerLabel: ({ focused }) => (
                            <Text style={{ color: focused ? "#000" : "#fff", fontSize: 30, fontWeight: "bold" }}>
                                Movies
                            </Text>
                        ),
                        headerTitle: "Movies",
                        drawerIcon: ({ focused }) => <HeartIcon size={30} color={focused ? "#000" : "#fff"} />,
                    }}
                />
                <Drawer.Screen
                    name="favoritetvseries"
                    options={{
                        headerShown: false,
                        drawerLabel: ({ focused }) => (
                            <Text style={{ color: focused ? "#000" : "#fff", fontSize: 30, fontWeight: "bold" }}>
                                Tv Series
                            </Text>
                        ),
                        headerTitle: "Tv Series",
                        drawerIcon: ({ focused }) => <HeartIcon size={30} color={focused ? "#000" : "#fff"} />,
                    }}
                />
                <Drawer.Screen
                    name="favoriteactors"
                    options={{
                        headerShown: false,
                        drawerLabel: ({ focused }) => (
                            <Text style={{ color: focused ? "#000" : "#fff", fontSize: 30, fontWeight: "bold" }}>
                                Actors
                            </Text>
                        ),
                        headerTitle: "Actors",
                        drawerIcon: ({ focused }) => <HeartIcon size={30} color={focused ? "#000" : "#fff"} />,
                    }}
                />
                <Drawer.Screen
                    name="cinemas"
                    options={{
                        headerShown: false,
                        drawerLabel: ({ focused }) => (
                            <Text style={{ color: focused ? "#000" : "#fff", fontSize: 30, fontWeight: "bold" }}>
                                Cinemas
                            </Text>
                        ),
                        headerTitle: "Cinemas",
                        drawerIcon: ({ focused }) => <MapPinIcon size={30} color={focused ? "#000" : "#fff"} />,
                    }}
                />
                <Drawer.Screen
                    name="testapi"
                    options={{
                        headerShown: false,
                        drawerLabel: ({ focused }) => (
                            <Text style={{ color: focused ? "#000" : "#fff", fontSize: 30, fontWeight: "bold" }}>
                                Test API
                            </Text>
                        ),
                        headerTitle: "Test API",
                        drawerIcon: ({ focused }) => <GlobeAltIcon size={30} color={focused ? "#000" : "#fff"} />,
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
