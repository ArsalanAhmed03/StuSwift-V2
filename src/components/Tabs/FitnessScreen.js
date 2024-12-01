import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { Card, Avatar } from "react-native-paper";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Pedometer } from "expo-sensors";
import { useFocusEffect } from "@react-navigation/native";
import {
  FetchFitnessData,
  UpdateFitnessData,
} from "../../services/Firebase/Fetching.js";

const FitnessScreen = ({ navigation }) => {
  const [fitnessData, setFitnessData] = useState({});
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [calories, setCalories] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);
  const [waterIntake, setWaterIntake] = useState(0);
  const [heartCondition, setHeartCondition] = useState("Unknown");

  const caloriesPerStep = 0.04;

  useEffect(() => {
    const requestActivityRecognitionPermission = async () => {
      if (Platform.OS === "android") {
        const { status } = await Pedometer.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Activity recognition permission is required to count steps."
          );
        }
      }
    };

    requestActivityRecognitionPermission();
  }, []);

  // Fetch data from Firebase when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const data = await new FetchFitnessData().fetchdata();
          if (data) {
            setFitnessData(data);
            setCurrentStepCount(data.stepCount || 0);
            setCalories(data.calories || 0);
            setSleepHours(data.sleepHours || 0);
            setWaterIntake(data.waterIntake || 0);
            evaluateHeartCondition(data);
          }
        } catch (error) {
          console.error("Error fetching fitness data:", error);
        }
      };

      fetchData();
    }, [])
  );

  // Pedometer setup
  useEffect(() => {
    const initializePedometer = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(isAvailable ? "available" : "unavailable");

        if (!isAvailable) {
          console.error("Pedometer is not available on this device.");
          return;
        }

        const subscription = Pedometer.watchStepCount((result) => {
          if (result && result.steps) {
            const steps = result.steps;
            const newCalories = steps * caloriesPerStep;

            // Update local state
            setCurrentStepCount(steps);
            setCalories(newCalories);

            // Update Firebase
            new UpdateFitnessData().fetchdata({
              stepCount: steps,
              calories: newCalories,
            });
          }
        });

        return () => {
          subscription && subscription.remove();
        };
      } catch (error) {
        console.error("Error initializing pedometer:", error);
      }
    };

    initializePedometer();
  }, []);

  // Evaluate heart condition based on fitness data
  const evaluateHeartCondition = (data) => {
    const isGoodCondition =
      (data.calories || 0) >= (data.goalCalories || 1000) &&
      (data.sleepHours || 0) >= 7 &&
      (data.waterIntake || 0) >= 2;

    setHeartCondition(isGoodCondition ? "Good" : "Needs Improvement");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fitness</Text>

      {/* Calories Card */}
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <AnimatedCircularProgress
            size={100}
            width={10}
            fill={(calories / (fitnessData.goalCalories || 1000)) * 100}
            tintColor="#4C4CFF"
            backgroundColor="#e0e0e0"
            lineCap="round"
          >
            {(fill) => (
              <Text style={styles.progressText}>
                {Math.round((fill / 100) * (fitnessData.goalCalories || 1000))}{" "}
                Kcal
              </Text>
            )}
          </AnimatedCircularProgress>
          <Text style={styles.cardTitle}>
            Calories Burned: {calories.toFixed(2)}
          </Text>
        </View>
      </Card>

      {/* Row with Sleep and Water Cards */}
      <View style={styles.row}>
        {/* Sleep Card */}
        <Card
          style={styles.smallCard}
          onPress={() => navigation.navigate("SleepDuration")}
        >
          <View style={styles.smallCardContent}>
            <Avatar.Icon
              size={24}
              icon="bed"
              color="white"
              style={styles.icon}
            />
            <Text style={styles.smallCardTitle}>Sleep</Text>
            <Text style={styles.smallCardValue}>{sleepHours} hr</Text>
          </View>
        </Card>

        {/* Water Intake Card */}
        <Card
          style={styles.smallCard}
          onPress={() => navigation.navigate("WaterIntakeTracker")}
        >
          <View style={styles.smallCardContent}>
            <Avatar.Icon
              size={24}
              icon="water"
              color="white"
              style={styles.icon}
            />
            <Text style={styles.smallCardTitle}>Water</Text>
            <Text style={styles.smallCardValue}>{waterIntake} ml</Text>
          </View>
        </Card>
      </View>

      {/* Heart Condition Card */}
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <Avatar.Icon
            size={24}
            icon="heart"
            color="white"
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>Heart Condition</Text>
          <Text style={styles.conditionText}>Condition: {heartCondition}</Text>
        </View>
      </Card>

      {/* Steps Card */}
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <Avatar.Icon
            size={24}
            icon="walk"
            color="white"
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>Steps</Text>
          <Text style={styles.cardValue}>
            {currentStepCount}/{fitnessData.stepGoal || 10000} steps
          </Text>
          <Text style={styles.conditionText}>
            Pedometer: {isPedometerAvailable}
          </Text>
        </View>
      </Card>

      {/* Activity Settings Card */}
      <Card
        style={styles.card}
        onPress={() => navigation.navigate("ActivitySettings")}
      >
        <View style={styles.cardContent}>
          <Avatar.Icon size={24} icon="cog" color="white" style={styles.icon} />
          <Text style={styles.cardTitle}>Activity Settings</Text>
          <Text style={styles.conditionText}>
            Adjust your goals and preferences
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    width: "90%",
    marginVertical: 10,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#F8F9FF",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginVertical: 10,
  },
  smallCard: {
    width: "45%",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#4C4CFF",
  },
  cardContent: {
    alignItems: "center",
  },
  progressText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4C4CFF",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  smallCardContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  smallCardTitle: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
  },
  smallCardValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  icon: {
    backgroundColor: "#4C4CFF",
  },
  conditionText: {
    fontSize: 14,
    color: "#777",
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default FitnessScreen;
