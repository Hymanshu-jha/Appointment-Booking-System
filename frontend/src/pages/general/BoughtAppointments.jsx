import { useContext, useState, useEffect } from "react";
import AuthContext from "../../contexts/AuthContext";
import { AppointmentCard } from "../../components/AppointmentCard";

const apiUrl = import.meta.env.VITE_API_URL;

const BoughtAppointments = () => {
  const { user } = useContext(AuthContext);
  const [boughtAppointments, setBoughtAppointments] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `${apiUrl}/appointment/fetchAppointmentsByUserId/${user._id}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Error fetching bought appointments");
        const data = await res.json();
        setBoughtAppointments(data.appointments || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAppointments();
  }, [user?._id]);

  return (
    <ul className="space-y-5 max-w-3xl mx-auto">
      {boughtAppointments.map((appt) => (
        <AppointmentCard appointment={appt} key={appt._id} />
      ))}
    </ul>
  );
};

export default BoughtAppointments;
