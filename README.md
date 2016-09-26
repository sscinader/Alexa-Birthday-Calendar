# Alexa-Birthday-Calendar
### A Birthday Calendar for Amazon Alexa

### Setup Mode
- [x] What is calendar owner's  name?
- [x] When is calendar owner's Birthday?

### Edit Mode
- [ ] Edit a name
- [ ] Edit a birthday
- [ ] Delete an entry
- [ ] Reset all

### Query Mode
- [ ] Whose birthday is next?
- [ ] Is there a birthday today?
- [x] When is [name]'s birthday
- [x] How old is [name]
- [ ] Whose calendar is this?
- [x] How many more days till [name]'s birthday
- [ ] How many days till Christmas (easter egg :)).
- [x] List birthdays

### Entry Mode
- [x] [name]'s birthday
- [x] [date]


### Stored Attributes

```
this.attributes['owner'] = string Name// the name of the owner of the calendar

this.attributes['birthdays'] = {
    name: birthday
}

// Stores the name and birthday of
// a new entry while it is being entered
// and validated
this.attributes['currentlyAdding']
```
