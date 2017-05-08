import React from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import { Paper } from 'material-ui'

import Menubar from '../components/Menubar'

const AboutPage = () => (
	<main>
		<Helmet>
			<title>SSSC Booking Manager | About</title>
		</Helmet>

		<Menubar title="SSSC Booking Manager" />

		<section>
			<Paper className="paper about">
				<div className="sssc text-center">
					<img src="/static/images/SSSCLogo.png" alt="SSSC Logo" />
					<h1 className="header">Swinburne Sarawak Student Council</h1>
					<p>For the students, by the students.</p>
				</div>
				<p>As the voice of the students, SSSC reaches to students and gets their feedback to the management so that the student experience on campus is improved. Furthermore, SSSC members also acts as volunteers, assisting in events and activities organized by the management and clubs.</p>
				<p>SSSC also plans and organizes our own events such as Prom Night, Swinburne Carnival, Cultural Night and many more. Our main mission is to provide a bridge for communication between the students and the management so that the student life on campus can be improved.</p>
				<p>We strive to enrich the student experience on campus, further the best interests of its members as part of the University’s provision of student services and bridge cultural gaps that may exist among students from various religious and cultural backgrounds.</p>
			</Paper>

			<Paper className="paper about">
				<h1 className="header">Disclaimer</h1>
				<p>This online system is created mainly for educational and non-commercial use only. It is a partial fulfilment for the completion of the unit COS30043 – Interface Design & Development offered in Swinburne University of Technology, Sarawak Campus for Semester 1, 2017. (enter the semester and year)</p>
				<p>The web-master, designer and developer does not represent the business entity. However, the web develop has obtained consent and approval from the business representative, SSSC on 30 January 2017 to use their information and resources for the purpose of content development.</p>
				<p>The content or information of this online system might be out-dated or inaccurate, thus, the web-developer and web-master does not take any responsibility for incorrect information disseminate or cited from this online system.</p>
				<p>Visitors are advised to visit the <Link to="https://www.facebook.com/swinburnestudentcouncil/" className="text-color-dark">official facebook page</Link> to get the actual information</p>
				<p>If you believe that information of any kind on this online system is an infringement of copyright in material in which you either own copyright or are authorized to exercise the rights of a copyright owner, kindly contact the web-developer at ssscsarawak@gmail.com or web-master cum Lecturer, Mr. Ong Chin Ann (cong@swinburne.edu.my) for removal.</p>
			</Paper>
		</section>
	</main>
)

export default AboutPage
