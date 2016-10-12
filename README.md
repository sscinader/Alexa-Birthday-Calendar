[![Build Status](https://travis-ci.org/sscinader/Alexa-Birthday-Calendar.svg?branch=master)](https://travis-ci.org/sscinader/Alexa-Birthday-Calendar)
# Alexa-Birthday-Calendar
### A Birthday Calendar for Amazon Alexa

### Problems:
1. Doesn't handle prosesive names well
1. No real way to get last names
1. Due to #2, there's not really a way to handle multiples with the same first name.

### Setup Mode
- [x] What is calendar owner's  name?
- [x] When is calendar owner's Birthday?

### Edit Mode
- [ ] Delete an entry
- [ ] Reset all

### Query Mode
- [ ] Whose birthday is next?
- [x] When is [name]'s birthday
- [x] How old is [name]
- [x] Whose calendar is this?
- [x] How many more days till [name]'s birthday
- [x] How many days till Christmas (easter egg :)).
- [x] List birthdays

### Entry Mode
- [x] [name]'s birthday
- [x] [date]


### Stored Attributes

```
// the name of the owner of the calendar
this.attributes['owner'] = string Name

// Object that contains a map of names and birthdays
this.attributes['birthdays'] = {
  name: birthday
}

// Stores the name and birthday of
// a new entry while it is being entered
// and validated
this.attributes['currentlyAdding'] = {
  name: Sadie,
  birthday: '2007-05-26'
}
```
