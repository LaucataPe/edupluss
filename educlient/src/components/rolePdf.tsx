import React from "react";
import { Document, Page, Text, StyleSheet, Font } from "@react-pdf/renderer";
import { Role } from "../utils/interfaces";

// Establecer la fuente personalizada (puedes cargar una fuente externa)
Font.register({
  family: "Roboto",
  src: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu72xKOzY.woff2",
});

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    lineHeight: 1.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 12,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 15,
  },
});

// Componente que renderizará el PDF
const PDFWorkerProfile: React.FC<{ workerProfile: Role }> = ({
  workerProfile,
}) => {
  const formattedSalary =
    workerProfile.salary &&
    parseFloat(workerProfile.salary.replace(/\D/g, "")).toLocaleString("es-CO");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Perfil del Trabajador</Text>

        <Text style={styles.sectionTitle}>Cargo:</Text>
        <Text style={styles.sectionContent}>{workerProfile.name}</Text>

        <Text style={styles.sectionTitle}>Habilidades Técnicas:</Text>
        {workerProfile.hardSkills.map((skill, index) => (
          <Text key={index} style={styles.listItem}>
            - {skill}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>Habilidades Interpersonales:</Text>
        {workerProfile.softSkills &&
          workerProfile.softSkills.map((skill, index) => (
            <Text key={index} style={styles.listItem}>
              - {skill}
            </Text>
          ))}
        {!workerProfile.softSkills && `No se especifica`}

        <Text style={styles.sectionTitle}>Horario:</Text>
        <Text style={styles.sectionContent}>
          {workerProfile.schedule}
          {!workerProfile.schedule && `No se especifica`}
        </Text>

        <Text style={styles.sectionTitle}>Salario:</Text>
        <Text style={styles.sectionContent}>
          {`${formattedSalary} COP`}
          {!workerProfile.salary && `No se especifica`}
        </Text>

        <Text style={styles.sectionTitle}>Experiencia:</Text>
        <Text style={styles.sectionContent}>
          {workerProfile.experience &&
            `${workerProfile.experience?.[0]} a ${workerProfile.experience?.[1]} años`}
          {!workerProfile.experience && `No se especifica`}
        </Text>

        <Text style={styles.sectionTitle}>Trabajo Remoto:</Text>
        <Text style={styles.sectionContent}>
          {workerProfile.remote ? "Sí" : "No"}
        </Text>
      </Page>
    </Document>
  );
};

export default PDFWorkerProfile;
