# Alexa-Birthday-Calendar
### A Birthday Calendar for Amazon Alexa

### Setup Mode
- [x] What is calendar owner's  name?
- [x] When is calendar owner's Birthday?

### Edit Mode
- [ ] Edit a name
- [ ] Edit a birthday
- [ ] Delete an entry

### Query Mode
- [ ] Whose birthday is next?
- [ ] Is there a birthday today?
- [ ] When is [name]'s birthday
- [x] How old is [name]
- [ ] whose calendar is this?
- [ ] How many more days till [name]'s birthday
- [ ] list birthdays

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
