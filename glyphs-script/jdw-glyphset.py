#MenuTitle: Collection of all glyphs in a json list
__doc__="""
Loop through the current font file and generate a list for all the glyphs. 
For each glyph save the name, string, unicode and unicode nice name.
Bundle it all up in groups based on glyph category.
Save it to a file on the user's desktop with the name of the font. 
"""


import json
import os.path
import unicodedata
Glyphs.clearLog()
Glyphs.showMacroWindow()


# ----------------------------
# Functions
# ----------------------------

def convert_case(value) :
	match value :
		case 0 : case_value = ''
		case 1 : case_value = 'Uppercase'
		case 2 : case_value = 'Lowercase'
		case 3 : case_value = 'Small Caps'
		case 4 : case_value = 'Minor'
		case _ : case_value = ''
	return case_value
	
	
def ij_exceptions(glyph) :
    # this_string is the base letter
    # this_accent is the diacritic part of the letter    
    if (( 'ij' in glyph ) or ( 'IJ' in glyph )) :
        this_string = glyph[:2]
        this_accent = glyph[2:]
    else :
        this_string = glyph[:1]
        this_accent = glyph[1:]
        
    glyph_components = this_string + ' + ' + this_accent + 'comb'        
    glyph_info = glyph, this_string, '', '', glyph_components
    return glyph_info


def create_this_glyph(glyph, css) :
    if ( 'Private Use' == glyph.category ) :
        glyph_info = glyph.name, glyph.string, glyph.unicodeChar(), '', ''
        
    elif ( 'Ligature' == glyph.subCategory ) :
        # The Catalan ones are ligatures
        # Give them special treatment for now
        if ( ".locl" in thing.name ) :
            glyph_info = glyph.name, glyph.string, glyph.unicodeChar(), '', ''
        else :
            # Most ligatures won't have a string
            # Create one by removing _ from the glyph.name
            # If one of the parts is a diacritic find the string code from the parent
            
            # Remove the extension
            currentName = glyph.name
            # Remove extension from the name
            stripped_name = currentName.split(".", 1)[0]
            # Separate the parts in a lits
            # Use the "_" to create the parts
            name_parts = stripped_name.split('_')
            
            # Check each part to build new string
            new_string = ''
            new_unicode = []
            for part in name_parts :
                if ( 1 == len(part) ):
                    new_string += part
                else :
                    # find the parent string
                    parent_info = Glyphs.font.glyphs[part]
                    if ( parent_info ) :
                        parent_string = parent_info.string
                        new_string += parent_string
                    else :
                        new_string += part
                new_unicode.append(Glyphs.glyphInfoForName(part).unicodeChar())

            glyph_components = new_string + ' + ' + css
            glyph_info = glyph.name, new_string, new_unicode, '', glyph_components

                    

    elif (( "" == glyph.string ) and ( "." not in glyph.name )) :
        # Jacute, jacute, idotaccent, ijactue, IJacute
        # These glyphs do not have a string and are regular characters
        # Some may not needed in a font, but COULD BE in a font
        # This is the fallback in case they are
        glyph_info = ij_exceptions(glyph.name)

    elif ( "" == glyph.string ) :
        # Give glyphs a meaningful string if they don't have one
        # First remove the extension from the name
        # This gives the name of the parent glyph
        parent_name = glyph.name.split(".", 1)[0] 
                
        # Check for "_" in the name
        # It is a thing made up of parts if there are
        # They need special treatment
        if ( "_" not in parent_name ) :
            # The parent glyph is the "normal" version of this thing
            # Use it to find the original string, unicode and unicode name
            parent_info = Glyphs.font.glyphs[parent_name]
            parent_string = parent_info.string

            # Create an extra data field for the components that make up this glyph
            glyph_components = parent_string + ' + ' + css
            
            glyph_info = glyph.name, parent_string, parent_info.unicodeChar(), unicodedata.name(parent_string).title(), glyph_components
                
        else :
            print("-> it has parts", glyph.name)
            glyph_info = ""
            
    else :
        glyph_info = glyph.name, glyph.string, glyph.unicodeChar(), unicodedata.name(glyph.string).title(), ''
    
    return glyph_info


def write_json(target_path, target_file, data):
    if not os.path.exists(target_path):
        try:
            os.makedirs(target_path)
        except Exception as e:
            print(e)
            raise
    with open(os.path.join(target_path, target_file), 'w') as f:
        json.dump(data, f)


# ----------------------------
# Variables
# ----------------------------

category = ''
thisCategory = {}
glyphList = []

ligatures = ''
thisLigatureset = {}
ligatureList = []

styleset = ''
thisStyleset = {}
stylesList = []


# ----------------------------------------------------
# Preamble to get the UPM and metrics for the fonts
# ----------------------------------------------------

metrics = {}

# Get the UPM
for font in Glyphs.fonts :
	metrics['upm'] = font.upm

# Find the metrics for each font
# Save as an average of all values
metrics['metrics'] = []

for font in Glyphs.fonts :
    ascender = []
    capHeight = []
    xHeight = []
    descender = []
    
    for master in font.masters :
        ascender.append(master.ascender)
        capHeight.append(master.capHeight)
        xHeight.append(master.xHeight)
        descender.append(abs(master.descender))
        
    avg_ascender = round(sum(ascender) / len(ascender))
    avg_capHeight = round(sum(capHeight) / len(capHeight))
    avg_xHeight = round(sum(xHeight) / len(xHeight))
    avg_descender = round(sum(descender) / len(descender))
    
    metrics['metrics'].append(avg_ascender)
    metrics['metrics'].append(avg_capHeight)
    metrics['metrics'].append(avg_xHeight)
    metrics['metrics'].append(avg_descender)
    
# The exported instances
metrics['fonts'] = []
for instance in Font.instances :
    if ( instance.active ) :
    	thisFont = instance.fullName, instance.weightClass, instance.isItalic
    	metrics['fonts'].append(thisFont)
	
glyphList.append(metrics)


# ----------------------------
# The main show
# ----------------------------

# Loop through the glyphs
for thing in Glyphs.font.glyphs:

    # Skip glyphs: non export & category == 'Separator'
    if (( True == thing.export ) and ( 'Separator' != thing.category )) :
        
        currentCategory = thing.category
        currentCase = thing.case
        # Certain glyph extensions get their own category 
        currentCSSClass = ''
        
        # Glyph Category filtering
        # ------------------------
        # Change the Letter category to the case value
        if ( 'Letter' == currentCategory ) :
            currentCategory = convert_case(thing.case)
            if ( 'Small Caps' == currentCategory ) :
                currentCSSClass = 'smcp'
            elif ( 'Minor' == currentCategory ) :
                currentCSSClass = 'ordn'
        
        # Change the Number category to be more specific
        if ( 'Number' == currentCategory ) :
            if ( 'Decimal Digit' == thing.subCategory ) :
                # Numbers without an extension are the default figures
                if ( ".lf" in thing.name ) :
                    currentCategory = 'Proportional Lining Figures'
                    currentCSSClass = 'lnum'
                elif ( ".osf" in thing.name ) :
                    currentCategory = 'Proportional Old-Style Figures'
                    currentCSSClass = 'onum'
                elif ( ".tf" in thing.name ) :
                    currentCategory = 'Tabular Lining Figures'
                    currentCSSClass = 'tnum'
                elif ( ".tosf" in thing.name ) :
                    currentCategory = 'Tabular Old-Style Figures'
                    currentCSSClass = 'onum tnum'
                else :
                    currentCategory = 'Figures'                
                
            if ( 'Fraction' == thing.subCategory ) :
                currentCategory = 'Fractions'
                currentCSSClass = 'frac'
            if ( 'Small' == thing.subCategory ) :
                currentCategory = 'Small Figures'        
            
        # Change the Symbol category to be more specific
        if ( 'Symbol' == currentCategory ) :
            if ( 'Currency' == thing.subCategory ) :
                currentCategory = 'Currency'
            elif ( 'Math' == thing.subCategory ) :
                currentCategory = 'Math'
            elif ( 'Arrow' == thing.subCategory ) :
                currentCategory = 'Arrows'        
            elif ( 'Emoji' == thing.subCategory ) :
                currentCategory = 'Emoji'  
            elif ( 'Geometry' == thing.subCategory ) :
                currentCategory = 'Geometry'  
            else :
                currentCategory = 'Symbols'  

        # If category is empty
        # Should probably do something in that case


        # Create glyph category
        # ------------------------
        # If this is a new category, create a new group
        # The IJacute is a tricky thing, it does not have a category
        # It will be included in the locl group later
        if ( currentCategory != category ) :
        
            category = currentCategory
            thisCategory = {}
            thisCategory['category'] = category
            if ( '' != currentCSSClass ) :
                thisCategory['css'] = currentCSSClass
            thisCategory['glyphs'] = []
            glyphList.append(thisCategory)
                        
            
        # Glyph filtering
        # ------------------------
        # Skip ".case" glyphs
        if ( ".case" in thing.name ) or ( ".locl" in thing.name ) :
            glyph_ok = "no"
        else :
            glyph_ok = "yes"
        

        # Marks: only save the combining glyphs, leave out all the others
        # If thing.name has "." -> skip
        # If thing.name does not have "comb" -> skip
        if ( 'Mark' == currentCategory ) :
            # Check for "."
            if ( "." not in thing.name ) and ( "comb" in thing.name ) :
                glyph_ok = "yes"
            else :
                glyph_ok = "no"
                
        
        # Specials: ligature glyphs
        # ------------------------
        # Ligatures have their own category
        # They can occur in more than one place
        # Wait with adding them to the glyphList until the end
        if (( 'Ligature' == thing.subCategory ) and ( "yes" == glyph_ok )) :
            glyph_ok = "ligature"
            currentCSSClass = "liga"
            
            # If this is the first ligature, create a new group
            if ( thing.subCategory != ligatures ) :

                ligatures = thing.subCategory
                ligatureset_exists = "no"
                
                for ligature in ligatureList :
                    if ( ligatures == ligature['category'] ) :
                        ligatureset_exists = "yes"
                        break
                        
                # Create set if it doesn't exist already
                if ( "no" == ligatureset_exists ) :
                    thisLigatureset = {}
                    thisLigatureset['category'] = 'Ligatures'
                    thisLigatureset['css'] = currentCSSClass
                    thisLigatureset['glyphs'] = []
                    ligatureList.append(thisLigatureset)
                                    
            
        # Specials: .ss glyphs
        # ------------------------
        # Treat stylistics sets as a separate category
        # There can be many (up to 20?)
        # Each one can have glyphs of different categories
        # So wait with adding them to glyphList until the end
        if ( ".ss" in thing.name ) :
            glyph_ok = "wait"
            
            # Find name and label of this stylistic set
            currentGlyph = thing.name
            ss = currentGlyph.split(".ss", 1)
            currentStyleSet = "ss" + ss[1] if len(ss) > 1 else ""
            currentCSSClass = currentStyleSet
            for feature in Font.features :
                #print(feature.name)
                currentStyleSet_label = feature.name
                """
                if ( feature.name == currentStyleSet) :
                    for label in feature.labels() :
                        currentStyleSet_label = label.value
                """
                        
            # If this is a new stylistic set, create a new group
            if ( currentStyleSet != styleset ) :
            
                styleset = currentStyleSet
                styleset_exists = "no"
                
                for style in stylesList :
                    if ( styleset == style['category'] ) :
                        styleset_exists = "yes"
                        break
                
                	# Create set if it doesn't exist already
                if ( "no" == styleset_exists ) :
                    thisStyleset = {}
                    thisStyleset['category'] = styleset
                    thisStyleset['category_name'] = currentStyleSet_label
                    thisStyleset['css'] = styleset
                    thisStyleset['glyphs'] = []
                    stylesList.append(thisStyleset)
    

        # Save glyph to file
        # ------------------------
        if ( "no" != glyph_ok ) :        
            thisGlyph = create_this_glyph(thing, currentCSSClass)
        
        # Save the current glyph to thisCategory
        if ( "yes" == glyph_ok ) :        
            thisCategory['glyphs'].append(thisGlyph) 
            
        elif ( "ligature" == glyph_ok ) :
            thisLigatureset['glyphs'].append(thisGlyph)
                
        elif ( "wait" == glyph_ok ) :                        
            if ( "no" == styleset_exists ) :
                thisStyleset['glyphs'].append(thisGlyph) 
                
            else :
                # Append to the existing styleset
                existing = None
                for style in stylesList :
                    if ( style['category'] == styleset ) :
                        existing = style
                        existing['glyphs'].append(thisGlyph) 
                        break
        

# If there is a ligatures set list
if ( len(thisLigatureset) != 0 ) :
    glyphList.append(thisLigatureset)

# If there is a stylistic set list
if ( len(stylesList) != 0 ) :
    # Order numerically
    sorted_stylesList = sorted(stylesList, key=lambda x: (x['category']))
    # Add the style sets to the glyph list
    glyphList.extend(sorted_stylesList)


# ----------------------------
# Save the data to file
# ----------------------------

# Find the font name of the current font
for font in Glyphs.fonts:
    thisFont = font.familyName

if ( thisFont ) :
    file_name = thisFont + '_glyphs.json'
else :
    file_name = 'glyphs.json'

# Write JSON object to file on Desktop
file_location = os.path.expanduser('~/Desktop')
write_json(file_location, file_name, glyphList)
print('DONE: ' + file_location + '/' + file_name)

