#version 330 core

smooth in vec3 final_color1;
flat in vec3 final_color2;
uniform sampler2D ourTexture;
uniform sampler2D normalMap;
in vec2 TexCoord;

uniform bool isNormal;
uniform bool isDiffuse;
uniform bool isFlat;

layout( location = 0 ) out vec4 FragColor;

in vec3 TangentLightPos;
in vec3 TangentLightDir;
in vec3 TangentViewPos;
in vec3 TangentFragPos;

uniform bool point_light_status;
in vec3 point_ambient;
in vec3 point_diffuse;
in vec3 point_specular;

uniform bool dir_light_status;
in vec3 dir_ambient;
in vec3 dir_diffuse;
in vec3 dir_specular;

vec3 lightDir;
vec3 ambient;
vec3 diffuse;
vec3 specular;

void main()
	{		
		//NORMAL MAPPING
		vec3 normal = texture(normalMap, TexCoord).rgb;
		vec3 diffuse = texture(ourTexture, TexCoord).rgb;
		
		normal = normalize(normal * 2.0 - 1.0);
		diffuse = normalize(diffuse * 2.0 - 1.0);
 		
		//Ambient
			if(point_light_status)
			{
				ambient = 0.5 * point_ambient*0.5;
				lightDir = normalize(TangentLightPos - TangentFragPos);
			}
			
			if(dir_light_status)
			{
				ambient = 0.5*dir_ambient*0.5;
				lightDir = normalize(-TangentLightDir);
			}
			
		
		//Diffuse
			float normal_diff = max(dot(lightDir, normal), 0.0);
			
			if(point_light_status)
			{
				diffuse = normal_diff * point_diffuse*0.5;
			}
			
			if(dir_light_status)
			{
				diffuse = normal_diff * dir_diffuse * 0.5;
			}
	
		//Specular
			vec3 viewDir = normalize(TangentViewPos - TangentFragPos);
			vec3 reflectDir = reflect(-lightDir, normal);
			vec3 halfwayDir = normalize(lightDir + viewDir);  
			float spec = pow(max(dot(normal, halfwayDir), 0.0), 32.0);
			//float diffuse_spec = pow(max(dot(diffuse, halfwayDir), 0.0), 32.0);
			
			if(point_light_status)
			{
				specular = point_specular*spec;
			}
			
			if(dir_light_status)
			{
				specular = dir_specular*spec*0.5;
			}
			
			vec4 colorNormal = vec4(ambient + diffuse + specular, 1.0);
			
		//Normal only
		if(isNormal && !isDiffuse)
		{
				FragColor = vec4((ambient + diffuse + specular), 1.0);
		}
		
		//Diffuse only
		if(isDiffuse && !isNormal)
		{
			FragColor = texture2D(ourTexture, TexCoord)* vec4(final_color1,1.0f) * 2.0f;
		}
	
		//Both
		if(isNormal && isDiffuse)
		{
			FragColor = texture2D(ourTexture, TexCoord)*colorNormal;
		}
		
		//Neither
		if(!isNormal && !isDiffuse)
		{
			if(isFlat)
			{
				FragColor = vec4(final_color2,1.0f);
			}
			else
		    {
				FragColor = vec4(final_color1,1.0f);

			}
		}
	}













