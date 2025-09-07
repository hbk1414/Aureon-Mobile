import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AureonTheme } from "../theme";

const T = AureonTheme("blue"); // or "purple" / "violet"

export function ProgressBar({ label, value, total }:{ label:string; value:number; total:number }) {
  const pct = Math.min(1, value / total);
  return (
    <View>
      <View style={s.row}>
        <Text style={s.label}>{label}</Text>
        <Text style={s.pill}>{Math.round(pct * 100)}%</Text>
      </View>
      <View style={s.track}>
        <View style={[s.fill, { width: `${pct*100}%`, backgroundColor: T.primary }]} />
      </View>
      <View style={s.sub}><Text style={s.muted}>Used {value.toLocaleString()} / {total.toLocaleString()}</Text></View>
    </View>
  );
}

const s = StyleSheet.create({
  row:{ flexDirection:"row", justifyContent:"space-between", marginBottom:10 },
  label:{ color: T.text, fontWeight:"700", fontSize:16 },
  pill:{ backgroundColor: "#EEF0FF", color: T.text, fontWeight:"700", paddingHorizontal:10, paddingVertical:4, borderRadius:999 },
  track:{ height:10, backgroundColor:"#E9EAF2", borderRadius:999, overflow:"hidden" },
  fill:{ height:"100%" },
  sub:{ marginTop:8 }, 
  muted:{ color:T.muted, fontSize:13 },
});
