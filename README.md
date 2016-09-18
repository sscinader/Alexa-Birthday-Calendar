# Alexa-Birthday-Calendar
A Birthday Calendar for Amazon Alexa

SetupState
- What is your name?
- When is your Birthday?

Query State
- Whose birthday is next
- Is there a birthday today
- When is [name]'s birthday
- How old is Name
Add a new birthday (for [name])
- whose calendar is this?

Entry State
- [name]'s birthday
- [date]


Stored Attributes

this.attributes['owner'] = string Name// the name of the owner of the calendar
this.attributes['birthdays'] = {
    name: birthday
}