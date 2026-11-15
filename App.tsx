import React, { useMemo, useState } from "react";
import {
  SafeAreaView, View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Modal, Pressable, StatusBar
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

type Task = {
  id: number;
  title: string;
  time: string;
  tag: string;
  color: string;
  done: boolean;
  priority?: "High" | "Medium" | "Low";
};

type Tab = "Today" | "Calendar" | "Tasks" | "Focus" | "Profile";

const initialTasks: Task[] = [
  { id: 1, title: "Review project brief", time: "09:00 AM", tag: "Work", color: "#6475E8", done: false, priority: "High" },
  { id: 2, title: "Prepare weekly plan", time: "10:30 AM", tag: "Personal", color: "#D59B45", done: false, priority: "Medium" },
  { id: 3, title: "Read 20 pages", time: "01:00 PM", tag: "Learning", color: "#36A58A", done: true, priority: "Low" },
  { id: 4, title: "Workout", time: "05:30 PM", tag: "Health", color: "#D9788D", done: false, priority: "Medium" },
];

const tabs: { key: Tab; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "Today", icon: "sunny-outline" },
  { key: "Calendar", icon: "calendar-outline" },
  { key: "Tasks", icon: "checkbox-outline" },
  { key: "Focus", icon: "timer-outline" },
  { key: "Profile", icon: "person-outline" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("Today");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState("");

  const completed = useMemo(() => tasks.filter(t => t.done).length, [tasks]);
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const toggleTask = (id: number) =>
    setTasks(current => current.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const addTask = () => {
    const title = newTask.trim();
    if (!title) return;
    setTasks(current => [...current, {
      id: Date.now(), title, time: "Anytime", tag: "Inbox",
      color: "#8A8D98", done: false, priority: "Medium"
    }]);
    setNewTask("");
    setModalOpen(false);
    setActiveTab("Today");
  };

  const renderTask = (task: Task) => (
    <View key={task.id} style={styles.taskRow}>
      <TouchableOpacity
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.done }}
        onPress={() => toggleTask(task.id)}
        style={[styles.checkbox, task.done && styles.checkboxDone]}
      >
        {task.done && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
      </TouchableOpacity>
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, task.done && styles.taskTitleDone]}>{task.title}</Text>
        <View style={styles.taskMeta}>
          <View style={[styles.tagDot, { backgroundColor: task.color }]} />
          <Text style={styles.taskTag}>{task.tag}</Text>
          <Text style={styles.metaDivider}>·</Text>
          <Text style={styles.taskTime}>{task.time}</Text>
        </View>
      </View>
      {task.priority === "High" && <View style={styles.priorityMark} />}
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-horizontal" size={19} color="#A0A1A8" />
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (activeTab === "Today") {
      return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.eyebrow}>SUNDAY, NOVEMBER 15</Text>
              <Text style={styles.greeting}>Good evening, Alex</Text>
              <Text style={styles.subGreeting}>A little progress goes a long way.</Text>
            </View>
            <TouchableOpacity style={styles.avatar}><Text style={styles.avatarText}>A</Text></TouchableOpacity>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressTop}>
              <View>
                <Text style={styles.cardLabel}>TODAY'S PROGRESS</Text>
                <Text style={styles.progressNumber}>{completed}<Text style={styles.progressSlash}> / {tasks.length} tasks</Text></Text>
              </View>
              <View style={styles.progressBadge}><Text style={styles.progressBadgeText}>{progress}%</Text></View>
            </View>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>
            <Text style={styles.progressHint}>{progress === 100 ? "Everything is done. Nice work!" : "Keep going. You're building momentum."}</Text>
          </View>

          <View style={styles.sectionHeader}>
            <View><Text style={styles.sectionTitle}>Your day</Text><Text style={styles.sectionCaption}>A clear plan for what matters.</Text></View>
            <TouchableOpacity style={styles.filterButton}><Ionicons name="options-outline" size={19} color="#555968" /></TouchableOpacity>
          </View>

          <View style={styles.taskGroup}>
            <View style={styles.groupHeading}><Text style={styles.groupLabel}>UP NEXT</Text><Text style={styles.groupCount}>{tasks.filter(t => !t.done).length} tasks</Text></View>
            {tasks.filter(t => !t.done).map(renderTask)}
            {tasks.every(t => t.done) && <Text style={styles.emptyText}>Nothing pending. Enjoy the space.</Text>}
          </View>

          {tasks.some(t => t.done) && (
            <View style={[styles.taskGroup, { marginTop: 22 }]}>
              <View style={styles.groupHeading}><Text style={styles.groupLabel}>COMPLETED</Text><Text style={styles.groupCount}>{completed} done</Text></View>
              {tasks.filter(t => t.done).map(renderTask)}
            </View>
          )}

          <View style={styles.habitsHeader}><Text style={styles.sectionTitle}>Daily habits</Text><TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity></View>
          <View style={styles.habitCard}>
            <Habit name="Reading" icon="book-outline" count="12 day streak" />
            <Habit name="Drink water" icon="water-outline" count="5 / 8 glasses" />
            <Habit name="Movement" icon="walk-outline" count="Not started" last />
          </View>
          <View style={{ height: 90 }} />
        </ScrollView>
      );
    }

    const descriptions: Record<Exclude<Tab, "Today">, string> = {
      Calendar: "See your tasks and plans across the week.",
      Tasks: "All your lists, priorities, and projects in one place.",
      Focus: "Make room for deep work, one session at a time.",
      Profile: "Your preferences and productivity insights."
    };
    return (
      <View style={styles.placeholder}>
        <View style={styles.placeholderIcon}>
          <Ionicons name={tabs.find(t => t.key === activeTab)?.icon ?? "apps-outline"} size={30} color="#5969D8" />
        </View>
        <Text style={styles.placeholderTitle}>{activeTab}</Text>
        <Text style={styles.placeholderText}>{descriptions[activeTab as Exclude<Tab, "Today">]}</Text>
        <Text style={styles.comingSoon}>FOUNDATION SCREEN · NEXT BUILD PHASE</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F7F5" />
      <ExpoStatusBar style="dark" />
      <View style={styles.appHeader}>
        <TouchableOpacity style={styles.menuButton}><Ionicons name="menu-outline" size={24} color="#252733" /></TouchableOpacity>
        <Text style={styles.brand}>dayflow<Text style={styles.brandDot}>.</Text></Text>
        <TouchableOpacity style={styles.searchButton}><Ionicons name="search-outline" size={21} color="#555968" /></TouchableOpacity>
      </View>

      <View style={styles.content}>{renderContent()}</View>

      <TouchableOpacity style={styles.fab} onPress={() => setModalOpen(true)} activeOpacity={0.85}>
        <Ionicons name="add" size={29} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        {tabs.map(tab => {
          const selected = activeTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} style={styles.navItem} onPress={() => setActiveTab(tab.key)}>
              <Ionicons name={tab.icon} size={22} color={selected ? "#5969D8" : "#999BA5"} />
              <Text style={[styles.navLabel, selected && styles.navLabelActive]}>{tab.key}</Text>
              {selected && <View style={styles.navIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <Modal visible={modalOpen} transparent animationType="slide" onRequestClose={() => setModalOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setModalOpen(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.modalTitle}>Create a task</Text>
            <Text style={styles.modalSubtitle}>Capture it now. Organize it when you're ready.</Text>
            <TextInput
              value={newTask}
              onChangeText={setNewTask}
              placeholder="What needs to get done?"
              placeholderTextColor="#A5A6AE"
              style={styles.taskInput}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={addTask}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalOpen(false)}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.createButton} onPress={addTask}><Text style={styles.createText}>Add task</Text></TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function Habit({ name, icon, count, last }: { name: string; icon: keyof typeof Ionicons.glyphMap; count: string; last?: boolean }) {
  return (
    <View style={[styles.habitRow, last && { borderBottomWidth: 0 }]}>
      <View style={styles.habitIcon}><Ionicons name={icon} size={18} color="#6874C9" /></View>
      <View style={{ flex: 1 }}><Text style={styles.habitName}>{name}</Text><Text style={styles.habitCount}>{count}</Text></View>
      <TouchableOpacity style={styles.habitCheck}><Ionicons name="checkmark" size={16} color="#A5A7B1" /></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F7F5" },
  appHeader: { height: 54, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  menuButton: { width: 34, height: 34, justifyContent: "center" },
  brand: { fontSize: 21, fontWeight: "800", letterSpacing: -0.8, color: "#252733" },
  brandDot: { color: "#5969D8" },
  searchButton: { width: 34, height: 34, alignItems: "flex-end", justifyContent: "center" },
  content: { flex: 1 },
  scrollContent: { paddingHorizontal: 21, paddingTop: 17 },
  greetingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 22 },
  eyebrow: { fontSize: 10, letterSpacing: 1.25, fontWeight: "700", color: "#92949E", marginBottom: 7 },
  greeting: { fontSize: 25, lineHeight: 31, fontWeight: "750", letterSpacing: -0.8, color: "#252733" },
  subGreeting: { fontSize: 12, color: "#92949E", marginTop: 4 },
  avatar: { width: 42, height: 42, borderRadius: 15, backgroundColor: "#E8EAFB", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#5969D8", fontWeight: "800", fontSize: 16 },
  progressCard: { backgroundColor: "#FFFFFF", borderRadius: 19, padding: 17, borderWidth: 1, borderColor: "#EEEEF0", marginBottom: 27 },
  progressTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  cardLabel: { fontSize: 9, letterSpacing: 1.1, fontWeight: "800", color: "#92949E", marginBottom: 5 },
  progressNumber: { fontSize: 25, fontWeight: "800", color: "#252733", letterSpacing: -0.7 },
  progressSlash: { fontSize: 13, fontWeight: "500", color: "#92949E", letterSpacing: 0 },
  progressBadge: { backgroundColor: "#EEF0FF", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 11 },
  progressBadgeText: { color: "#5969D8", fontSize: 12, fontWeight: "800" },
  progressTrack: { height: 6, backgroundColor: "#F0F0F2", borderRadius: 5, overflow: "hidden" },
  progressFill: { height: 6, backgroundColor: "#6675E4", borderRadius: 5 },
  progressHint: { fontSize: 11, color: "#92949E", marginTop: 10 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 19, fontWeight: "800", color: "#252733", letterSpacing: -0.4 },
  sectionCaption: { fontSize: 11, color: "#999BA4", marginTop: 4 },
  filterButton: { width: 36, height: 36, backgroundColor: "#FFFFFF", borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#EEEEF0" },
  taskGroup: { backgroundColor: "#FFFFFF", borderRadius: 17, paddingHorizontal: 15, paddingTop: 14, paddingBottom: 3, borderWidth: 1, borderColor: "#EEEEF0" },
  groupHeading: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  groupLabel: { color: "#9B9DA6", fontSize: 9, letterSpacing: 1.1, fontWeight: "800" },
  groupCount: { color: "#A4A5AD", fontSize: 10 },
  taskRow: { minHeight: 66, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#F1F1F2" },
  checkbox: { width: 21, height: 21, borderRadius: 7, borderWidth: 1.6, borderColor: "#C9CBD4", alignItems: "center", justifyContent: "center", marginRight: 12 },
  checkboxDone: { backgroundColor: "#6675E4", borderColor: "#6675E4" },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: 13, fontWeight: "650", color: "#30323D" },
  taskTitleDone: { color: "#A7A8B0", textDecorationLine: "line-through" },
  taskMeta: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  tagDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  taskTag: { fontSize: 10, color: "#92949E" },
  metaDivider: { color: "#C7C8CE", marginHorizontal: 6, fontSize: 12 },
  taskTime: { fontSize: 10, color: "#92949E" },
  priorityMark: { width: 5, height: 5, borderRadius: 3, backgroundColor: "#E17D76", marginRight: 8 },
  moreButton: { padding: 5 },
  emptyText: { fontSize: 12, color: "#999BA4", paddingVertical: 18, textAlign: "center" },
  habitsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 25, marginBottom: 12 },
  seeAll: { color: "#5969D8", fontSize: 11, fontWeight: "700" },
  habitCard: { backgroundColor: "#FFFFFF", borderRadius: 17, paddingHorizontal: 14, borderWidth: 1, borderColor: "#EEEEF0" },
  habitRow: { height: 61, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#F1F1F2" },
  habitIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: "#F0F1FC", alignItems: "center", justifyContent: "center", marginRight: 10 },
  habitName: { fontSize: 12, fontWeight: "700", color: "#343641" },
  habitCount: { fontSize: 10, color: "#9A9CA5", marginTop: 3 },
  habitCheck: { width: 25, height: 25, borderRadius: 9, borderWidth: 1, borderColor: "#E2E3E8", alignItems: "center", justifyContent: "center" },
  fab: { position: "absolute", right: 23, bottom: 84, width: 54, height: 54, borderRadius: 19, backgroundColor: "#5969D8", alignItems: "center", justifyContent: "center", elevation: 6, shadowColor: "#5969D8", shadowOpacity: 0.25, shadowRadius: 9, shadowOffset: { width: 0, height: 5 } },
  bottomNav: { height: 67, flexDirection: "row", backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#EEEEF0", justifyContent: "space-around", paddingTop: 8, paddingBottom: 5 },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 3 },
  navLabel: { fontSize: 9, color: "#9B9DA6", fontWeight: "600" },
  navLabelActive: { color: "#5969D8", fontWeight: "800" },
  navIndicator: { position: "absolute", top: -8, width: 20, height: 2, borderRadius: 2, backgroundColor: "#5969D8" },
  placeholder: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 45 },
  placeholderIcon: { width: 66, height: 66, borderRadius: 22, backgroundColor: "#EEF0FF", alignItems: "center", justifyContent: "center", marginBottom: 17 },
  placeholderTitle: { fontSize: 24, fontWeight: "800", color: "#252733" },
  placeholderText: { fontSize: 13, color: "#92949E", textAlign: "center", lineHeight: 20, marginTop: 8 },
  comingSoon: { fontSize: 9, letterSpacing: 1.2, fontWeight: "800", color: "#A5A7B0", marginTop: 22 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(22,24,34,0.35)", justifyContent: "flex-end" },
  modalSheet: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 22, paddingBottom: 35 },
  sheetHandle: { width: 37, height: 4, borderRadius: 2, backgroundColor: "#E3E4E8", alignSelf: "center", marginBottom: 20 },
  modalTitle: { fontSize: 21, fontWeight: "800", color: "#252733" },
  modalSubtitle: { fontSize: 12, color: "#92949E", marginTop: 5, marginBottom: 18 },
  taskInput: { height: 52, borderWidth: 1, borderColor: "#E8E8EC", borderRadius: 13, paddingHorizontal: 14, color: "#252733", fontSize: 14 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 17 },
  cancelButton: { paddingHorizontal: 17, height: 43, justifyContent: "center" },
  cancelText: { color: "#777985", fontWeight: "700", fontSize: 12 },
  createButton: { height: 43, backgroundColor: "#5969D8", borderRadius: 12, paddingHorizontal: 20, alignItems: "center", justifyContent: "center" },
  createText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
});
