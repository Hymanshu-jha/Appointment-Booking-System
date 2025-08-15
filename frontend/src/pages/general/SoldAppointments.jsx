import { useContext, useState, useEffect } from "react";
import AuthContext from "../../contexts/AuthContext";
import { AppointmentCard } from "../../components/AppointmentCard";

const apiUrl = import.meta.env.VITE_API_URL;

const SoldAppointments = () => {
  const { user } = useContext(AuthContext);
  const [soldAppointments, setSoldAppointments] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `${apiUrl}/appointment/fetchAppointmentsSoldByUserId/${user._id}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Error fetching sold appointments");
        const data = await res.json();
        setSoldAppointments(data.appointments || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAppointments();
  }, [user?._id]);

  return (
    <ul className="space-y-5 max-w-3xl mx-auto">
      {soldAppointments.map((appt) => (
        <AppointmentCard appointment={appt} key={appt._id} />
      ))}
    </ul>
  );
};

export default SoldAppointments;
