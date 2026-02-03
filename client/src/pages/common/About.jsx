import React from 'react';
import './About.css';

const About = () => {

    return (
        <div className="ourdestination">
            <div className="about">
                <header className="project">
                    <h1 className="tittle">
                        Smart Shuttle System
                    </h1>
                </header>

                <div className="overview">
                    <section className="Team">
                        <h2 className="developer">Developed By</h2>
                        <p className="name">Vignesh </p>
                        <p className="dept">Computer Science Engineering(Artificial Intelligence and Machine Learning)</p>
                        <p className="batch">2024-2028 Batch</p>
                    </section>

                    <section className="projectoverview">
                        <h2 className="heading">Project Overview</h2>
                        <p className="aboutproject">
                            The Smart Shuttle Booking System is a comprehensive web application designed to modernize urban commuting.
                            It bridges the gap between passengers and shuttle owners, offering a seamless platform for booking rides,
                            tracking vehicles, and managing routes. This project aims to reduce traffic congestion and carbon footprints
                            by promoting shared mobility.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default About;