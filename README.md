tempo-whats-up
==============

A simple application utilizing undocumented JIRA Tempo APIs to let you log time continuously, quickly, and efficiently

Usage
=====

Launch the application, you should be greeted by a friendly question next to an 'X'. Type the answer to the question. Ignore the application until the answer to said queston changes. If it does, refocus the application and start typing a new answer. Repeat as many times as desired. Click the 'X' to close the application and log your final answer.

What?
=====
You type text into the main field. When you finish typing (unfocus the aplication or stop typing for about 15 seconds), a timer begins. When you refocus the application and type again, the time is noted alongside the message you typed. This process repeats until you close the application, at which point the last message and duration are logged.


JIRA/Tempo Integration
======================
On launch, the aplication should open a JIRA login page in a new window for you. Log in, and everything should be good to go for awhile. The auth cookie stored by your login will be automatically used by subsequent requests until the cookie expires.

Start your messages with an issue key followed by a colon to have time logged against that issue and the remainder of your message be used as a log message, ie `INT-23: Constructing additional pylons`. Starting your message with an invalid key or without a key at all will cause a new issue to be created under the configured `TIMETRAP` project and the time logged against that, with your message as the issue description.

Since Tempo lets you edit your history, this means that you can be super lazy and log all your time through `TIMETRAP` unallocated messages and then go back later and move the time ot where it needs to be. Or, if you want to be complete, you can log your time directly against existing tickets.